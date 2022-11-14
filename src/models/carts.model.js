const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Cart = new Schema({
  id: ObjectId,
  product_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  quantity: Number,
  status: Number
});

module.exports = mongoose.model('Cart', Cart);