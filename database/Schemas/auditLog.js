const { Schema, model } = require("mongoose");
const str = (defaultTxt) =>  defaultTxt ? {type: String, required: true, default: defaultTxt} : {type: String, required: false};

const auditLogSchema = new Schema({
    id: str(""),
    user: str(""),
    guild: str(""),
    error: { 
        type: Boolean,
        required: true,
        default: false
    },
    date: str(Date.now()),
    description: str(""),
    filters: {
        type: Array,
        required: true,
        default: ["all"]
    }
}, { versionKey: false });

module.exports = model("auditlog", auditLogSchema);