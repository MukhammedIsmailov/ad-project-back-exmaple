const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Filter = new Schema({
  label: String,
  language: Array,
  region: Array,
  subscriptionDate: Array,
  browser: Array,
  os: Array,
  userId: Schema.Types.ObjectId
});

const filter = mongoose.model('Filters', Filter);

module.exports = filter;
