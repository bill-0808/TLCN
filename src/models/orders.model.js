const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
  _id: Schema.Types.ObjectId,
  total: Number,
  status: Number,
  ship_id: Schema.Types.ObjectId,
  payment_method: Number,
  complete_date: Date,
  account_id: Schema.Types.ObjectId,
  promotion_id: Schema.Types.ObjectId,
  location: String,
});

module.exports = mongoose.model('Order', Order);