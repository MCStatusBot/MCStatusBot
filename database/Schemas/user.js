const { Schema, model } = require('mongoose');

const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: true, default:false };

const serverSchema = new Schema({
    id: str(""),
    username: str(),
    email: str("unknown@mcstatusbot.site"),
    tag: str(),
    avatar: str(),
    lan: str("EN"),
    theme: str("default"),
    donator: bol,
    admin:bol
}, { versionKey: false })

module.exports = model('user', serverSchema);