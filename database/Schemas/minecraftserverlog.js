const { Schema, model } = require('mongoose');
var uuid = require('uuid');

const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: false };

const serverSchema = new Schema({
    id: str(uuid.v4().replaceAll('-','')),
    mcserverid: str(),
    time: str(),
    online: bol,
    playersOnline: str(),
    playerNamesOnline: str()
}, { versionKey: false })

module.exports = model('minecraftserverlog', serverSchema);