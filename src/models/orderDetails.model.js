const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderDetail = new Schema({
  id: ObjectId,
  product_id: Schema.Types.ObjectId,
  quantity: Number,
  order_id: Schema.Types.ObjectId,
});

module.exports = mongoose.model('OrderDetail', OrderDetail);