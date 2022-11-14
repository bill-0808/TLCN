const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const News = new Schema({
  id: ObjectId,
  content: String,
  thumbnail: String,
  title: String
});

module.exports = mongoose.model('News', News);