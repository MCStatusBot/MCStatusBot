const { Schema, model } = require('mongoose');

const serverSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: false },
    icon: { type: String, required:  false},
    mcServers: { type: Array, required: true, default: []},


    bluemapurl: { type: String, required: false },
    timezone: { type: String, required: false },
    Bedrock: { type: Boolean, required: false },
    Logging: { type: Boolean, default: false },
  
    CategoryId: { type: String, required: false },
    config: {
        notifications: {
            webhook: {
                enabled: { type: Boolean, required: false },
                url: { type: String, required: false },
                content: { type: String, required: false },
                for: { online: { type: Boolean, required: false }, offline: { type: Boolean, required: false } }
            },
            email: {
                enabled: { type: Boolean, required: false },
                emails: { type: Array, required: false },
                subject: { type: String, required: false },
                content: { type: String, required: false },
                for: { online: { type: Boolean, required: false }, offline: { type: Boolean, required: false } }
            }
        },
        chart: {
            embed: {
                uptime: {
                    title: { type: String, required: false, default: "[ip]'s uptime" },
                    description: {
                        type: String,
                        required: false,
                        default: '[ip] was up for [uptime] minutes and down for [downtime] minutes. This means that [ip] has a uptime percentage of [onlinepercent] and downtime percentage of [offlinepercent]'
                    },
                    color: { type: String, required: false, default: '#FFFFF' }
                },
                playersonline: {
                    title: { type: String, required: false, default: 'Number of players online on [ip]' },
                    description: { type: String, required: false, default: 'There have been a maximum of [maxplayers] players online at once, and a minimum of [minplayers].' },
                    color: { type: String, required: false, default: '#FFFFF' }
                },
                mostactive: {
                    title: { type: String, required: false, default: 'Most active players on [ip] in the last 24 hours' },
                    description: { type: String, required: false, default: '[mostactive] was the most active player with [mostactiveminutes] minutes spent online in the last 24 hours.' },
                    color: { type: String, required: false, default: '#FFFFF' }
                }
            },
            graph: {
                text: {
                    title: { type: String, required: false, default: '253, 253, 253' },
                    time: { type: String, required: false, default: '253, 253, 253' },
                    state: { type: String, required: false, default: '253, 253, 253' }
                },
                line: {
                    fill: { type: String, required: false, default: '8, 174, 228' },
                    border: { type: String, required: false, default: '39, 76, 113' }
                }
            }
        }
    }
}, { versionKey: false })

module.exports = model('discordserver', serverSchema);