const { Schema, model } = require('mongoose');
const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: true, default:false };
const statusSchema = new Schema({
    id: str(""),
    user: str(),
    mcserver: str(),
    online: {
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]] is [[server.status]]"),
        body: str("hello [[user.username]],\nthe minecraft server is now [[server.status]]")
    },
    offline: {
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]] is [[server.status]]"),
        body: str("hello [[user.username]],\nthe minecraft server is now [[server.status]]")
    },
    maxmemberIncrese: {
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]]'s max members have [[server.changetype.maxmembers]]"),
        body: str("hello [[user.username]],\nthe minecraft server has [[server.changetype.maxmembers]] from [[server.old.maxmembers]] to [[server.maxmembers]]")
    },
    maxmemberDecrees:{
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]]'s max members have [[server.changetype.maxmembers]]"),
        body: str("hello [[user.username]],\nthe minecraft server has [[server.changetype.maxmembers]] from [[server.old.maxmembers]] to [[server.maxmembers]]")
    },
    versionIncrese:{
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]]'s version has changed"),
        body: str("hello [[user.username]],\nthe minecraft server's version has changed from [[server.old.version]] to [[server.version]]")
    },
    versionIecrees: {
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]]'s version has changed"),
        body: str("hello [[user.username]],\nthe minecraft server's version has changed from [[server.old.version]] to [[server.version]]")
    },
    motdChange: {
        enabled:bol,
        subject: str("[[server.ip]]:[[server.port]]'s motd has changed"),
        body: str("hello [[user.username]],\nthe minecraft server's motd has chnnaged from [[server.old.motd]] to [[server.motd]]")
    },
}, { versionKey: false });
module.exports = model('emailstatuschangenotifications', statusSchema);