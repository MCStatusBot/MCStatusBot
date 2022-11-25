const fs = require('fs');
const util = require('util');
const Redis = require('ioredis');
const { Sequelize } = require('sequelize');
const processlog = require('../utils/processlog');

let redisClient;
const sequelize = new Sequelize(process.env.DATABASE_URL)
const schemas = {
    AuditLog: require('./schemas/AuditLog')(sequelize),
    DiscordGuild: require('./schemas/DiscordGuild')(sequelize),
    emailnotification: require('./schemas/EmailNotification')(sequelize),
    MinecraftServer: require('./schemas/MinecraftServer')(sequelize),
    MinecraftServerLog: require('./schemas/MinecraftServerLog')(sequelize),
    User: require('./schemas/User')(sequelize),
    UserSession: require('./schemas/UserSession')(sequelize),
    WebsiteTheme: require('./schemas/WebsiteTheme')(sequelize),
};



/**
 * connect to the databases
 * @param {Object} params - config params.
 */
module.exports.connect = async (params) => {
    processlog.info('starting db service');

    //connect to database
    try {
        await sequelize.authenticate();
        processlog.success('Connection has been established successfully.');
    } catch (error) {
        processlog.error('Unable to connect to the database:', error);
        process.exit();
    }

    //connect to redis cache
    const redisDetails = process.env.REDIS.split(':');
    redisClient = new Redis({
        password: redisDetails.length == 3 ? redisDetails[0] : null,
        host: redisDetails.length == 3 ? redisDetails[1] : redisDetails[0],
        port: redisDetails.length == 3 ? redisDetails[2] : redisDetails[1]
    });

    if (params) {
        if (params.bot == true) {
            redisClient.hget = util.promisify(redisClient.hget);
            redisClient.hgetall = util.promisify(redisClient.hgetall);
            //if sharding process dont flush cache
            return true;
        }
    }

    // Flush redis db
    await redisClient.flushdb(async (err, succeeded) => {
        processlog.info(`Flushing Redis -  ${err ? err : succeeded}`);
        // Cache it only after redis gets flushed
        processlog.info('Started caching the databases');

        //loop though all scheams and cache them after flush
        for (const [key] of Object.entries(schemas)) {
            await schemas[key].findAll().then((results) => {
                for (const record of results) {
                    redisClient.hset(key, record.id, JSON.stringify(record));
                }
            });
        }
        //get launage files and cache them
        const lanFiles = fs.readdirSync(`${__dirname}/../languages/`).filter((file) => file.endsWith('.json'));
        for (let fileName of lanFiles) {
            if (fileName !== 'en.json') {
                let file = require(`${__dirname}/../languages/${fileName}`);
                redisclient.hset('lan', file.iso, JSON.stringify(file));
            }
        }
        return true;
    });
    return true;
}

/**
* fall back to database if cant find in cache
*/
async function dbFallback(table, id) {
    // db fallback
    processlog.info(`${id} just fellback to db while looking for the ${table} table!`);
    const checkDB = await schemas[table].findOne({ where: { id: key } });
    if (checkDB == null) return null;
    await redisClient.hset(table, id, JSON.stringify(checkDB));

    const cacheValue = await redisClient.hget(table, id);
    return cacheValue;
}


/**
 * lookup a document in the cache and fallback to mongo if its not there
 * @param {String} table - the table you want to lookup data in
 * @param {String} id - the id of the data you want to lookup
 * @returns {Object} 
 */
module.exports.lookup = async (table, key) => {
    if (schemas[table] == null || schemas[table] == undefined) {
        processlog.error(`${table} is not a valid table name`);
        return null;
    }
    let cacheValue = await redisClient.hget(table, key);
    let result = null;

    if (!cacheValue) cacheValue = await dbFallback(table, key);
    if (cacheValue == null) return null;

    result = JSON.parse(cacheValue);
    result['save'] = async function () {
        const dbresult = await schemas[table].findOne({ where: { id: key } });
        let toUpdate = {};

        for (const o in result) {
            if (result.hasOwnProperty(o)) {
                if (o !== 'save') {
                    if (dbresult[o] != result[o]) {
                        toUpdate[o] = result[o];
                    }
                }
            }
        }
        //update data in database
        try {
            await schemas[table].update(toUpdate, { where: { id } });
        } catch (err) {
            processlog.error(err.stack || err);
            return false;
        }

        //update data in cache
        await redisClient.hdel(table, key);
        await redisClient.hset(table, key, JSON.stringify(dbupdate));
        return true;
    }

    return result;
}


/**
 * create a new document in the database and cache it
 * @param {String} table - the table that you want to create data in
 * @param {String} id - the id you would like to use 
 * @param {Object} data - rest of the data
 * @returns 
 */
module.exports.create = async (table, id, data) => {
    if (schemas[table] == null || schemas[table] == undefined) throw "Error: " + table + " is not a valid table name";
    data.id = id;
    const createData = await schemas[table].create(data);
    await redisClient.hset(table, createData.id, JSON.stringify(createData));
    return true;
}


/**
 * get all documents in the cached table
 * @param {String} table 
 * @returns {Array}
 */
module.exports.getAll = async (table) => {
    if (schemas[table] == null || schemas[table] == undefined) throw "Error: " + table + " is not a valid table name";
    const items = await redisClient.hgetall(table);
    return Reflect.ownKeys(items).map((key) => JSON.parse(items[key]));
}


/**
 * delete a document from the cache and database
 * @param {String} table 
 * @param {String} id 
 * @returns {Boolean}
 */
module.exports.delete = async (table, id) => {
    if (schemas[table] == null || schemas[table] == undefined) throw "Error: " + table + " is not a valid table name";
    try {
        await schemas[collection].destroy({ where: { id } });
    } catch (err) {
        processlog.error(err.stack || err);
        throw "Error: could not delete from database"
    }
    try {
        await redisClient.hdel(table, id);
    } catch (err) {
        processlog.error(err.stack || err);
        throw "Error: could not delete from cache"
    }
    return true;
}