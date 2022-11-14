const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  id: ObjectId,
  name: String,
  age: Number,
  gender: Number,
  address: String,
  phone: String,
  cart_id: Schema.Types.ObjectId,
  is_active: Boolean,
  is_admin: Boolean
});

module.exports = mongoose.model('User', User);