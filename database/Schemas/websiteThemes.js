const { Schema, model } = require('mongoose');
const themeSchema = new Schema({ id: { type: String, required: true }, donator: { type: Boolean, required: true, default: false } }, { versionKey: false });
module.exports = model('websitethemes', themeSchema);