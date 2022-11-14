const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Ship = new Schema({
  id: ObjectId,
  type: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model('Ship', Ship);