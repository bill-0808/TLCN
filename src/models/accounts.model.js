const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Account = new Schema({
    id: ObjectId,
    user_id: Schema.Types.ObjectId,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});

module.exports = mongoose.model('Account', Account);