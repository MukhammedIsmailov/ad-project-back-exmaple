const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Campaign = new Schema({
  userID: String,
  serviceID: String,
  serviceUrl: String,
  serviceQuery: String,
  websiteID: String,
  websiteUrl: String,
  websiteIcon: String,
  date: Date,
  statusOfShipments: String,
  deliveredCount: Number,
  clickCount: Number,
  sent: Number,
  status: String,
  delayedDate: String,
  deliveryFailed: Number,
  pushNotifications: Array,
  subscribersArray: Array
});

const campaign = mongoose.model('Campaign', Campaign);

module.exports = campaign;

