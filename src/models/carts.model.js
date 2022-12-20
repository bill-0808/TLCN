const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Cart = new Schema({
  id: ObjectId,
  product_id: Schema.Types.ObjectId,
  account_id: Schema.Types.ObjectId,
  quantity: Number,
  size: Number,
});

module.exports = mongoose.model('Cart', Cart);