const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const DiscordGuild = sequelize.define('DiscordGuild', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        icon: {
            type: DataTypes.STRING,
            defaultValue: "none"
        },
        mcServers: {
            type: DataTypes.STRING,
            defaultValue: JSON.stringify([])
        },
        mainServer: {
            type: DataTypes.STRING,
            defaultValue: "NONE",
        },

        //mc server status embed config
        statusMessage_title: {
            type: DataTypes.STRING,
            defaultValue: "[[ICONS_server]] [[server_name]]'s status",
        },
        statusMessage_description: {
            type: DataTypes.STRING,
            defaultValue: "the server status of [[server_ip]][[server_port_wc]]"
        },
        statusMessage_statusText: {
            type: DataTypes.STRING,
            defaultValue: "```ip: [[server_ip]]\nstatus: offline\nversion: [[server_version]]\nplayers: [[server_players]]/[[server_players_max]]```"
        },
        statusMessage_image: {
            type: DataTypes.STRING,
            defaultValue: "https://mcstatusbot.site/icons/[[server_id]].png"
        },
        statusMessage_color_online: {
            type: DataTypes.STRING,
            defaultValue: "#22ff00"
        },
        statusMessage_color_offline: {
            type: DataTypes.STRING,
            defaultValue: "#ff0000"
        },

        //embed config
        //embed uptime
        embed_uptime_title: {
            type: DataTypes.STRING,
            defaultValue: "[[server_ip]]'s uptime"
        },
        embed_uptime_description: {
            type: DataTypes.STRING,
            defaultValue: "[[server_ip]] was up for [[server_uptime]] minutes and down for [[server_downtime]] minutes. This means that [[server_ip]] has a uptime percentage of [[server_online_percent]] and downtime percentage of [[server_offline_percent]]"
        },
        embed_uptime_color: {
            type: DataTypes.STRING,
            defaultValue: "#FFFFF"
        },

        //embed playersonline
        embed_playersonline_title: {
            type: DataTypes.STRING,
            defaultValue: "Number of players online on [[server_ip]]"
        },
        embed_playersonline_description: {
            type: DataTypes.STRING,
            defaultValue: "There have been a maximum of [[server_players_max]] players online at once, and a minimum of [[server_players_min]]."
        },
        embed_playersonline_color: {
            type: DataTypes.STRING,
            defaultValue: "#FFFFF"
        },

        //embed mostactive
        embed_mostactive_title: {
            type: DataTypes.STRING,
            defaultValue: "Most active players on [[server_ip]] in the last 24 hours"
        },
        embed_mostactive_description: {
            type: DataTypes.STRING,
            defaultValue: "[[server_mostactive]] was the most active player with [[server_mostactive_minutes]] minutes spent online in the last 24 hours."
        },
        embed_mostactive_color: {
            type: DataTypes.STRING,
            defaultValue: "#FFFFF"
        },

        //embed charts config
        //chart text
        graph_text_title: {
            type: DataTypes.STRING,
            defaultValue: "253, 253, 253"
        },
        graph_text_time: {
            type: DataTypes.STRING,
            defaultValue: "253, 253, 253"
        },
        graph_text_state: {
            type: DataTypes.STRING,
            defaultValue: "253, 253, 253"
        },
        //chart line
        graph_line_fill: {
            type: DataTypes.STRING,
            defaultValue: "8, 174, 228"
        },
        graph_line_border: {
            type: DataTypes.STRING,
            defaultValue: "39, 76, 113"
        },
    });
    //adds table to db if it doesnt exist
    DiscordGuild.sync();
    return DiscordGuild;
};