const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  gender: Number,
  address: String,
  phone: String,
  avatar: String
});

module.exports = mongoose.model('User', User);