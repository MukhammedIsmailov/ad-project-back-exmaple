const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Automation = new Schema({
  id_of_site: String,
  websiteUrl: String,
  label: String,
  completed: Number,
  pushSent: Number,
  queue: Number,
  status: String,
  subscribersArray: [{ type: Schema.Types.ObjectId, ref: 'Subscriber' }],
  userId: Schema.Types.ObjectId,
  notifications: Array,
  browserLang: String,
  createdAt: Date
});

const automation = mongoose.model('Automation', Automation);

module.exports = automation;
