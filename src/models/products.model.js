const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const now = new Date();

const Product = new Schema({
  id: ObjectId,
  name: String,
  product_image: [String],
  price: Number,
  type: Number,
  brand: String,
  description: String,
  gender: Number,
  color: String,
  size: Schema.Types.Mixed,
  is_active: Boolean,
  discount: Number,
  created_at: { type: Date, default: now }
});

module.exports = mongoose.model('Product', Product);