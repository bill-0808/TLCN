const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const now = new Date();

const News = new Schema({
  id: ObjectId,
  content: String,
  thumbnail: String,
  title: String,
  created_at: { type: Date, default: now }
});

module.exports = mongoose.model('News', News);