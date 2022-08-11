const { ShardingManager } = require('discord.js');
const api = require('./api/index');
const db = require('./database/index');

async function main() {
    const manager = new ShardingManager('./bot.js', { token: 'your-token-goes-here' });
    /*
     * why do you connect to db twice here and ./bot/index.js
     * sharding the bot makes multiple separate processes that will manage x amount of servers and the bot will need to access the db for some commands sooo wile i could some how pass the connection its just easy to do it this way   
     */
    await db.connect({bot: false});
    manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
    manager.spawn();
    api(manager, db);
}

main();