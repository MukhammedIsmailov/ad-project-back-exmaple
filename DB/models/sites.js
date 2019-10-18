const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sites = new Schema({
  url: {
    type: String,
    unique: true
  },
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'Subscriber' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notifications' }],
  icon: String,
  linkForSWRegistrator: String,
  linkForSW: String,
  logs: Array
});

const sites = mongoose.model('Sites', Sites);

module.exports = sites;
