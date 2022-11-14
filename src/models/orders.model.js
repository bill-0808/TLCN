const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Order = new Schema({
  id: ObjectId,
  total: Number,
  status: Number,
  ship_id: Schema.Types.ObjectId,
  payment_method: Number,
  complete_date: Number,
  user_id: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Order', Order);