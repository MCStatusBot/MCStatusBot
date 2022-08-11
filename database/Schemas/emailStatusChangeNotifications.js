const { Schema, model } = require('mongoose');
const bol = { type: Boolean, required: true, default:false };
const statusSchema = new Schema({
    id: str(""),
    user: str(),
    mcserver: str(),
    online: bol,
    offline: bol,
    maxmemberIncrese: bol,
    maxmemberDecrees:bol,
    versionIncrese:bol,
    versionIecrees: bol,
    motdChange: bol
}, { versionKey: false });
module.exports = model('emailstatuschangenotifications', statusSchema);