const fs = require('fs');
const util = require('util');
const logger = require('../log');
const Redis = require('ioredis');
const mongoose = require('mongoose');
let redisClient;
const schemas = {
    user: require('./Schemas/user'),
    discordserver: require('./Schemas/discordServer'),
    minecraftserver: require('./Schemas/minecraftServer'),
    websitethemes: require('./Schemas/websiteThemes'),

    emailstatuschangenotification: require('./Schemas/emailStatusChangeNotifications')
};



/**
 * connect to the databases
 * @param {Object} params 
 */
module.exports.connect = async(params) => {
    logger.info('starting db service')
    // Connect to database
    await mongoose.connect(process.env.DBURI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }).then(() => {
        logger.info('Connected to database!');
    }).catch((err) => {
        logger.error(err.stack || err);
    });

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
            return true;
        }
    }
    
    // Flush redis db
    await redisClient.flushdb(async (err, succeeded) => {
        logger.info(`Flushing Redis -  ${err ? err : succeeded}`);
        // Cache it only after redis gets flushed
        logger.info('Started caching the databases')
  
        //loop though all scheams and cache them after flush
        for (const [key] of Object.entries(schemas)) {
            await schemas[key].find({}).then((results) => {
                for (const document of results) {
                    redisClient.hset(key, document.id, JSON.stringify(document));
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
 * lookup a document in the cache and fallback to mongo if its not there
 * @param {String} collection 
 * @param {String} key 
 * @returns {Object} 
 */
module.exports.lookup = async (collection, key) => {
    if (schemas[collection] == null || schemas[collection] == undefined) {
        logger.error(`${collection} is not a valid collection name`);
        return null;
    }
    let cacheValue = await redisClient.hget(collection, key);
    var result = null

    if (cacheValue) {
      result = JSON.parse(cacheValue)
    } else {
        // Mongo fallback
        if (process.env.DEBUG) logger.info(`${key} just fellback to mongo while looking for the ${collection} collection!`);
        const checkMongo = await schemas[collection].findOne({id: key});
        if (checkMongo == null) return null;

        await redisClient.hset(collection, key, JSON.stringify(checkMongo));
        cacheValue = await redisClient.hget(collection, key);
        if (cacheValue) {
            result = JSON.parse(cacheValue)
        }
    }

    if (result == null) return null;
    result['save'] = async function () {
        var mdbupdate;
        if (schemas[collection] == null || schemas[collection] == undefined) {
            logger.error(`${collection} is not a valid collection name`);
            return null;
        }
        mdbupdate = await schemas[collection].findOne({id: key});

        for (const o in result) {
            if (result.hasOwnProperty(o)) {
                if (o !== 'save') {
                    mdbupdate[o] = result[o];
                }
            }
        }
        await mdbupdate.save();
        await redisClient.hdel(collection, key);
        await redisClient.hset(collection, key, JSON.stringify(mdbupdate));
        return true;
    }
    return result;
}


/**
 * create a new document in the database and cache it
 * @param {String} collection 
 * @param {String} key 
 * @param {Object} data 
 * @returns 
 */
module.exports.create = async(collection, key, data) => {
    if (schemas[collection] == null || schemas[collection] == undefined) throw "Error: " + collection + " is not a valid collection name";
    data.id = key;
    await schemas[collection].create(data);
    const lkup = await schemas[collection].findOne({id:key});
    await redisClient.hset(collection, key, JSON.stringify(lkup));
    return true;
}


/**
 * get all documents in the cached collection
 * @param {String} collection 
 * @returns {Array}
 */
module.exports.getAll = async(collection) => {
    if (schemas[collection] == null || schemas[collection] == undefined) throw "Error: " + collection + " is not a valid collection name";
    const items = await redisClient.hgetall(collection);
    return Reflect.ownKeys(items).map((key) => JSON.parse(items[key]));
}


/**
 * delete a ducument from the cache and database
 * @param {String} collection 
 * @param {String} key 
 * @returns {Boolean}
 */
module.exports.delete = async(collection,key) => {
    if (schemas[collection] == null || schemas[collection] == undefined) throw "Error: " + collection + " is not a valid collection name";
    await schemas[collection].deleteOne({id:key});
    await  redisClient.hdel(collection, key);
    return true;
}