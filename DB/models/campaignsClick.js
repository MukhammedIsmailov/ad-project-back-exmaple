const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampaignsClick = new Schema({
  userID: {
    type: String,
    required: true
  },
  subscriberIP: String,
  ISO2: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  serviceID: {
    type: String,
    required: true
  },
  campaignID: {
    type: String,
    required: true
  },
  clicked: Boolean,
  delivered: Boolean,
  sent: Boolean,
  date: Date
});

const campaignsClick = mongoose.model('CampaignsClick', CampaignsClick);

module.exports = campaignsClick;

