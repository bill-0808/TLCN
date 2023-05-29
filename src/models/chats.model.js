const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const now = new Date();

const Chat = new Schema({
  id: ObjectId,
  sender_id: Schema.Types.ObjectId,
  receiver_id: Schema.Types.ObjectId,
  message: String,
  is_read: Boolean,
  created_at: { type: Date, default: now } 
});

module.exports = mongoose.model('Chat', Chat);