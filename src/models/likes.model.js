const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Like = new Schema({
  id: ObjectId,
  account_id: Schema.Types.ObjectId,
  product_id: Schema.Types.ObjectId
});

module.exports = mongoose.model('Like', Like);