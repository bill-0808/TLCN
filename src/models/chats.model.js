const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const now = new Date();

const Chat = new Schema({
  id: ObjectId,
  account_id: Schema.Types.ObjectId,
  is_admin: Boolean,
  message: String,
  is_read: Boolean,
  created_at: { type: Date, default: now } 
});

module.exports = mongoose.model('Chat', Chat);