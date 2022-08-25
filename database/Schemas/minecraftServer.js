const { Schema, model } = require('mongoose');

const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: false };

const serverSchema = new Schema({
    id: str(""),
    owner: str(),
    ip: str(),
    port: str(),
    domain: str(),
    motd: {
        html:str(),
        clean: str()
    },
    online: bol,
    members: str(),
    maxMembers: str(),
    lastUpadted: str("1104476400"),
    bluemapurl: str(),
    timezone: str("GMT"),
    Bedrock: bol,
    logging: bol
}, { versionKey: false })

module.exports = model('minecraftserver', serverSchema);