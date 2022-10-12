const { Schema, model } = require("mongoose");
const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: true, default:false };

const serverSchema = new Schema({
    id: str(""),
    name: str(""),
    icon: str(""),
    timezone: str("GMT"),

    //example object that will be in this array { "id": "aaa000", "name": "test mc server", "channelStatus": { "enabled": true, "instantUpdate": false, "lastUpdated": "1104476400", "category": "000", "status": "000", "playerCount": "000" }, "messageStatus": {"enabled": true, "lastUpdated": "1104476400", "channel": "000", "message": "000"}}
    mcServers: { type: Array, required: true, default: []},

    //id of main default server (for things when you use the log and ping commands without giving a mc server id, domain, ip:port)
    mainServer: "",

    statusMessage: {
        multipleMessageMode: bol,
        title: str("[[ICON_server]] [[server_name]]'s status"),
        description: str("the server status of [[server_ip]][[server_port_wc]]"),
        statusText: str("```ip: [[server_ip]]\nstatus: offline\nversion: [[server_version]]\nplayers: [[server_players]]/[[server_players_max]]```"),
        image: str("https://mcstatusbot.site/icons/[[server_id]].png"),
        color: {
            online: str("#22ff00"),
            offline: str("#ff0000"),
        }
    },

    chart: {
        embed: {
            uptime: {
                title: str("[[server_ip]]'s uptime"),
                description: str("[[server_ip]] was up for [[server_uptime]] minutes and down for [[server_downtime]] minutes. This means that [[server_ip]] has a uptime percentage of [[server_online_percent]] and downtime percentage of [[server_offline_percent]]"),
                color: str("#FFFFF")
            },
            playersonline: {
                title: str("Number of players online on [[server_ip]]"),
                description: str("There have been a maximum of [[server_players_max]] players online at once, and a minimum of [[server_players_min]]."),
                color: str("#FFFFF")
            },
            mostactive: {
                title: str("Most active players on [[server_ip]] in the last 24 hours"),
                description: str("[[server_mostactive]] was the most active player with [[server_mostactive_minutes]] minutes spent online in the last 24 hours."),
                color: str("#FFFFF")
            }
        },
        graph: {
            text: {
                title: str("253, 253, 253"),
                time: str("253, 253, 253"),
                state: str("253, 253, 253")
            },
            line: {
                fill: str("8, 174, 228"),
                border: str("39, 76, 113")
            }
        }
    }
}, { versionKey: false });

module.exports = model("discordguild", serverSchema);