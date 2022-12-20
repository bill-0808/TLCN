const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderDetail = new Schema({
  id: ObjectId,
  product_id: Schema.Types.ObjectId,
  quantity: Number,
  size: Number,
  order_id: Schema.Types.ObjectId,
  status: Number,
});

module.exports = mongoose.model('OrderDetail', OrderDetail);