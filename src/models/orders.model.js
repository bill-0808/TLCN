const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Order = new Schema({
  id: ObjectId,
  total: Number,
  status: Number,
  ship_id: Schema.Types.ObjectId,
  payment_method: Number,
  complete_date: Date,
  user_id: Schema.Types.ObjectId,
  promotion_id: Schema.Types.ObjectId,
  location: String,
});

module.exports = mongoose.model('Order', Order);