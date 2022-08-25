const { Schema, model } = require('mongoose');

const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: false };

const serverSchema = new Schema({
    id: str("t"),
    mcserverid: str("t"),
    time: str("t"),
    online: bol,
    playersOnline: str(),
    playerNamesOnline: str()
}, { versionKey: false })

module.exports = model('minecraftserverlog', serverSchema);