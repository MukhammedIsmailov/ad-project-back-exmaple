const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subscriberFields = require('./subscriberFields');

const Subscriber = new Schema(subscriberFields);
const subscriber = mongoose.model('Subscriber', Subscriber);

module.exports = subscriber;
