const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Promotion = new Schema({
  id: ObjectId,
  code: String,
  min_order: Number,
  discount_price: Number,
  use_date_from: Date,
  use_date_to: Date,
  amount: Number
});

module.exports = mongoose.model('Promotion', Promotion);