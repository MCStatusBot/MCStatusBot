const { Schema, model } = require("mongoose");
const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};
const bol = { type: Boolean, required: true, default:false };
const statusSchema = new Schema({
    id: str(""),
    user: str(),
    mcserver: str(),
    online: bol,
    offline: bol,
    maxmemberIncrese: bol,
    maxmemberDecrees: bol,
    versionIncrese: bol,
    versionIecrees: bol,
    motdChange: bol,
}, { versionKey: false });
module.exports = model("emailnotifications", statusSchema);