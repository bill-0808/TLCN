const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Rating = new Schema({
  id: ObjectId,
  product_id: Schema.Types.ObjectId,
  image: [String],
  comment: String,
  rate: Number,
  user_id: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Rating', Rating);