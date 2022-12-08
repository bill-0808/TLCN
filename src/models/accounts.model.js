const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const now = new Date();

const Account = new Schema({
    id: ObjectId,
    user_id: Schema.Types.ObjectId,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    is_admin: Boolean,
    is_active: Boolean,
    is_seller: Boolean,
    created_at: { type: Date, default: now }
});

module.exports = mongoose.model('Account', Account);