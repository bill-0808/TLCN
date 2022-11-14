const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema({
  id: ObjectId,
  name: String,
  image: [String],
  price: Number,
  type: Number,
  brand: String,
  description: String,
  gender: Number,
  color: String,
  size: Schema.Types.Mixed,
  is_active: Boolean,
  discount: Number
});

module.exports = mongoose.model('Product', Product);