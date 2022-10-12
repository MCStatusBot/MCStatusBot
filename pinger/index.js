const uuid = require('uuid');
const cron = require('node-cron');
const pingServer = require('./ping');
const db = require('../database/index');
const processlog = require('../log');
const emailNotification = require('./emailNotification');
const wait = (s) => new Promise((resolve) => setTimeout(resolve, parseFloat(s.toString() + '000')));

const genEmbed = require('./functions/genembed');

module.exports = (botShardingManager) => {
    processlog.info('starting pinger service');
    const pingInterval = parseInt(process.env.PINGER_INTERVAL);
    // Call the pinger every x minutes default to 5 if none set
    cron.schedule(`*/${pingInterval >= 1 && pingInterval < 60 ? pingInterval : '5'} * * * *`, () => {
        try {
            pinger(botShardingManager);
        } catch (err) {
            processlog.error('Error while updating mc server statuses: ' + err.stack || err);
        } finally {
            processlog.info('Done updating mc server statuses');
        }
    });
    return;
}
/**
 * loop though every minecraft server then ping it
 */
async function pinger(botShardingManager) {
    const mcServers = await db.getAll('minecraftserver');
    for (const sv of mcServers) {
        if (!sv.ip || sv.ip == '' || sv.ip.length < 1) continue;
        //lookup the server se we have the save function
        const mcServer = await lookup('minecraftserver', sv.id);
        //make the server ping
        const serverStats = await pingServer(mcServer);
        if (mcServer.logs) await addmcServerStatusLogs(mcServer, serverStats.playersSample);
        
        await emailNotification(mcServer);
        await discordGuildUpdater(botShardingManager, mcServer);
        await wait(1);
    }
}

/**
 * adds the logs from information collected this ping time 
 * @param {Object} mcServer - the minecraft server object returned from lookup
 * @param {*} playersSample - the playersample returned from mc server utils
 * @returns 
 */
async function addmcServerStatusLogs(mcServer, playersSample) {
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



/**
 * loop though discord guilds and update their channels and messages
 * @param {*} botShardingManager - the bots sharding manager
 * @param {Object} mcServer - the minecraft server object returned from lookup
 * @returns 
 */
async function discordGuildUpdater(botShardingManager, mcServer) {
    const discordGuilds = await db.getAll('discordguild');
    for (const dcg of discordGuilds) {
        //move to nex guild if this guild isnt monitoring this mc server
        if (dcg.mcServers.filter(mcss => mcss.id == mcServer.id)[0] == undefined) continue;

        //use lookup funtion so we can save guild data
        const discordGuild = await db.lookup('discordguild', dcs.id);
        //uh what but it might happen
        if (discordGuild == undefined || discordGuild == null) {
            processlog.warn('guild id undefined when running pinger update');
            continue;
        }
        const guildMcInfo = discordGuild.mcServers.filter(mcss => mcss.id == mcServer.id)[0];
        if (guildMcInfo.channelStatus.enabled == true) await runChannelInstantUpdates(botShardingManager, mcServer, discordGuild);
        await runMessageInstantUpdates(botShardingManager, mcServer, discordGuild);
    }

}



/**
 * updates server status message
 * @param {*} botShardingManager - the bots sharding manager
 * @param {Object} mcServer - the minecraft server object returned from lookup
 * @param {Object} discordGuild - the discord guild object returned from lookup
 * @returns 
 */
async function runMessageInstantUpdates(botShardingManager, mcServer, guild) {
    const guildMcInfo = guild.mcServers.filter(mcss => mcss.id == mcServer.id)[0];
    if (guildMcInfo.messageStatus.enabled === false) return;

    let mcServers = [];
    if (guild.statusMessage.multipleMessageMode === false) {
        for await (const gms of guild.mcServers) {
            //skip servers that have message status disabled 
            if (gms.messageStatus.enabled == false) continue;
            const getMcServer = await db.cache.lookup('minecraftserver', gms.id);
            if (getMcServer == null) continue;
            mcServers.push(getMcServer);
        }
    }
    function editMessage(c, { guild, channel, message, embed,loggerError  }) {
        try {
            c.guilds.cache.get(guild).channels.cache.get(channel).messages.fetch(message).edit({embeds: [embed]});
        } catch (err) {
            //TODO: check how server owner wants to get errors and send errors to owners dms, owners email or log channel
            //TODO: add error event to guild logs
            loggerError(err.stack || err);
        }
    }
    botShardingManager.broadcastEval(editMessage, { context: { guild: guild.id, channel: guildMcInfo.channel, message: guildMcInfo.message, embed: genEmbed(guild, mcSever, mcServers), loggerError: processlog.error } });
    //update last updated time
    guildMcInfo.lastUpdated = Date.now().toString();
    guild.save();
}



/**
 * updates channels for the lucky few that have instant channel updates 
 * @param {*} botShardingManager - the bots sharding manager
 * @param {Object} mcServer - the minecraft server object returned from lookup
 * @param {Object} discordGuild - the discord guild object returned from lookup
 * @returns 
 */
async function runChannelInstantUpdates(botShardingManager, mcServer, discordGuild) {
    //TODO: change language based on servers set language
    async function editChannel(c, { arg }) {
        if (arg.mcServer.online) {
            await c.guilds.cache.get(arg.discordGuild.id).channels.cache.get(arg.guildMcInfo.channelStatus.status).setName('🟢 ONLINE').catch((e) => arg.loggerwarn('Error updating channel (prob rate limit):' + e));
        } else {
            await c.guilds.cache.get(arg.discordGuild.id).channels.cache.get(arg.guildMcInfo.channelStatus.status).setName('🔴 OFFLINE').catch((e) => arg.loggerwarn('Error updating channel (prob rate limit):' + e));
        }
        c.guilds.cache.get(arg.discordGuild.id).channels.cache.get(arg.guildMcInfo.channelStatus.playerCount).setName(`👥 Players online: ${arg.mcServer.members}/${arg.mcServer.maxMembers}`).catch((e) => arg.loggerwarn('Error updating channel (prob rate limit):' + e));
    }
    const guildMcInfo = discordGuild.mcServers.filter(mcss => mcss.id == mcServer.id)[0];
    try {
        botShardingManager.broadcastEval(editChannel, { context: { arg: {discordGuild, guildMcInfo, mcServer, loggerwarn: processlog.warn} } });
        guildMcInfo.channelStatus.lastUpdated = Date.now().toString();
        await discordGuild.save();
    } catch (err) {

    }
}

