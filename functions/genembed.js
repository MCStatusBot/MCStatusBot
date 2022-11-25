/**
 * generate an embed from guild and mc server info
 * @param {object} guild - the discord guild object
 * @param {object} mcServer - the pinged mc server object
 * @param {object} mcServers - all mc servers the discord server has if mmm is disabled
 * @returns {object}
 */
module.exports = function (guild, mcServer, mcServers) {
    /**
     * adds the [[]] parmas to givent text
     * @param {String} text 
     * @returns {String}
     */
    function addInfo(text) {
        //minecraft server
        text.replaceAll('[[server_id]]', mcServer.id);
        text.replaceAll('[[server_ip]]', mcServer.ip);
        text.replaceAll('[[server_port]]', mcServer.port);
        text.replaceAll('[[server_port_wc]]', ':' + mcServer.port);
        text.replaceAll('[[server_domain]]', mcServer.domain);
        text.replaceAll('[[server_motd_text]]', mcServer.motd.clean);
        text.replaceAll('[[server_motd_html]]', mcServer.motd.html);
        text.replaceAll('[[server_online]]', mcServer.online);
        text.replaceAll('[[server_status]]', mcServer.online ? "online" : "offline");
        text.replaceAll('[[server_status_wi]]', mcServer.online ? "🟢 online" : "🔴 offline");
        text.replaceAll('[[server_members]]', mcServer.members);
        text.replaceAll('[[server_members_max]]', mcServer.maxMembers);
        text.replaceAll('[[server_lastupdated]]', mcServer.lastUpadted);
        text.replaceAll('[[server_timezone]]', mcServer.timezone);

        //TODO: add bedrock and java emojis to wi
        text.replaceAll('[[server_type]]', mcServer.bedrock ? "bedrock" : "java");
        text.replaceAll('[[server_type_wi]]', mcServer.bedrock ? " bedrock" : " java");

        //guild
        text.replaceAll('[[guild_id]]', guild.id);
        text.replaceAll('[[guild_name]]', guild.name);
        text.replaceAll('[[guild_icon]]', guild.icon);
        text.replaceAll('[[guild_timezone]]', guild.timezone);
        return text
    }
    /**
     * check lenght of given text
     */
    function checkLenght(text, type) {
        let maxLenght = 0;
        let shortenTo = 0;
        switch (type.toLowerCase()) {
            case 'title':
                maxLenght = 256;
                break;
            case 'description':
                maxLenght = 4096;
                break;
            case 'fieldname':
                maxLenght = 256;
                break;
            case 'fieldvalue':
                maxLenght = 1024;
                break;
            default:
                throw "Error: invalid text type provided"
        }
        shortenTo = maxLenght > 3 ? maxLenght - 3 : 0;
        if (text.length >= maxLenght) {
            return shortenTo;
        }
        return false;
    }
    let embed = {};
    embed.color = mcServer.online ? guild.statusMessage.color.online : guild.statusMessage.color.offline;
    embed.title = addInfo(guild.statusMessage.title);
    embed.description = addInfo(guild.statusMessage.statusText);
    embed.thumbnail.url = addInfo(guild.statusMessage.image);
    //check lenght if too long shorten and add ... after (explanation will be in docs)
    //TODO: add to faq why is text missing from my embed and ends with ...
    if (checkLenght(embed.title, 'TITLE') !== false) {
        embed.title.slice(0, checkLenght(embed.title, 'TITLE')) + '...';
    }
    if (checkLenght(embed.description, 'DESCRIPTION') !== false) {
        embed.description.slice(0, checkLenght(embed.title, 'DESCRIPTION')) + '...';
    }
    return embed;
}