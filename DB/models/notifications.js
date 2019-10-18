const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//url - is URL for redirect after click on notification
const Notifications = new Schema({
  userID: String,
  websiteId: String,
  websiteUrl: String,
  title: String,
  body: String,
  icon: String,
  actions: Array,
  image: String,
  url: String,
  date: Date,
  deliveredCount: Number,
  clickCount: Number,
  sended: Number,
  status: String,
  deliveryFailed: Number,
  subscribersArray: Array
});

const notifications = mongoose.model('Notifications', Notifications);

module.exports = notifications;
