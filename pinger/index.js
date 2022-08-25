const uuid = require('uuid');
const cron = require('node-cron');
const pingServer = require('./ping');
const db = require('../database/index');
const log = require('../log');
const notification = require('./emailNotification');
const wait = (s) => new Promise((resolve) => setTimeout(resolve, parseFloat(s.toString() + '000')));

module.exports = (botShardingManager) => {
    log.info('starting pinger service');
    const pingInterval = parseInt(process.env.PINGER_INTERVAL);
    // Call the pinger every x minutes default to 5 if none set
    cron.schedule(`*/${pingInterval >= 1 && pingInterval < 60 ? pingInterval : '5'} * * * *`, () => {
        try {
            pinger();
        } catch (err) {
            log.error('Error while updating mc server statuses: ' + err.stack || err);
        } finally {
            log.info('Done updating mc server statuses');
        }
    });
    return
}

async function pinger() {
    const mcServers = await db.getAll('minecraftserver');
    for (const sv of mcServers) {
        if (!sv.ip || sv.ip == '' || sv.ip.length < 1) continue;
        //lookup the server se we have the save function
        const mcServer = await lookup('minecraftserver', sv.id);
        //make the server ping
        const serverStats = await pingServer(mcServer);
        if (server.logging) await logs(mcServer, serverStats.playersSample);
        
        await notification(mcServer).catch((err) => {
            log.error(err.stack || err);
        });
        await wait(1);
    }
}

async function logs(mcServer, playersSample) {
    const genid = uuid.v4().replaceAll('-','');
    const playernames = playersSample.map((obj) => obj.name);
    await db.create('minecraftserverlog', genid, {
        id: genid,
        mcserverid: mcServer.id,
        time: Date.now().toString(),
        online: mcServer.online,
        playersOnline: mcServer.members,
        playerNamesOnline:  playernames.toString()
    });
    return;
}