const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DelayedDispatch = new Schema({
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  statusOfShipments: {
    type: String,
    required: true
  },
  websiteId: {
    type: String,
    required: true
  },
  pushData: {
    type: Object,
    required: false
  },
  serviceId: {
    type: String,
    required: false
  },
  campaignId: {
    type: String,
    required: false
  },
  delayDates: {
    type:Array,
    required: true
  }
});

const delayedDispatch = mongoose.model('DelayedDispatch', DelayedDispatch);

module.exports = delayedDispatch;

