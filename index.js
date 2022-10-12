const { ShardingManager } = require('discord.js');
const api = require('./api/index');
const db = require('./database/index');
const pinger = require('./pinger/index');

async function main() {
    const manager = new ShardingManager('./bot.js', { token: 'your-token-goes-here' });
    /*
     * why do you connect to db twice here and ./bot/index.js
     * sharding the bot makes multiple separate processes that will manage x amount of guilds 
     * and the bot will need to access the db for some commands sooo wile i could some how pass the connection its just easy to do it this way   
     */
    await db.connect({bot: false});
    manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
    manager.spawn();
    //start up api
    api(manager, db);
    //start up pinger
    pinger(manager);

}

main();