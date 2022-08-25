const util = require('minecraft-server-util');

/**
 * pings the servers ip and returns status.
 * @param {Object} server - The minecraft server object from cache lookup.
 * @returns {Object} - server status and information.
 */
module.exports = async(mcServer) => {
    if (mcServer.ip.length <= 0) throw "Error: mc server must have ip";
    if (mcServer.save == null || mcServer.save == undefined) throw "Error: mc server has no save function, please use obj returned from db functions";
    let result;
    try {
        if (server.bedrock) {
            result = await util.statusBedrock(mcServer.ip, mcServer.port ? mcServer.port : 19132);
        } else {
            result = await util.status(mcServer.ip, mcServer.port ? mcServer.port : 25565);
        }
    } catch (error) {
        //an error so server probably is offline
        mcServer.online = false;
        mcServer.members = "0";
        mcServer.motd.clean = "";
        mcServer.motd.html = "";
        mcServer.lastUpadted = Date.now().toString();
        await mcServer.save();
        return {playersSample: null};
    }
    //Aternos servers stay online and display Offline in their MOTD when they are actually offline
    if (!result || (server.ip.includes('aternos.me') && result.version == '§4● Offline')) {
        //server is offline
        mcServer.online = false;
        mcServer.members = "0";
        mcServer.motd.text = "";
        mcServer.motd.html = "";    
    } else {    
        //server is online
        mcServer.online = true;
        mcServer.members = result.players.online;
        mcServer.maxmembers =result.players.max;
        mcServer.motd = result.motd;
        await server.save();
    }
    mcServer.lastUpadted = Date.now().toString();
    await mcServer.save();
    return {playersSample: result.playersSample};
}