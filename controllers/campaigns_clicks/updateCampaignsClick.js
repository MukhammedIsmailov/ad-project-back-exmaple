const CampaignsClick = require('../../DB/models/campaignsClick');
const geoip = require('geoip-lite');
const moment = require('moment');

async function updateCampaignsClick(statisticAction, campaignID, subscriberIP) {
  const region = geoip.lookup(subscriberIP);
  const ISO2 = region.country; // ISO2 - standard short name of country: Uganda - UG

  const createdCampaignsClick = await CampaignsClick.find({
    ISO2,
    campaignID,
    subscriberIP
  }).exec();

  const campaignsClickID = createdCampaignsClick[0]._id;

  if(statisticAction === 'delivered'){
   return await CampaignsClick.findByIdAndUpdate(campaignsClickID, {delivered: true});
  }

  if(statisticAction === 'clicked'){
   return await CampaignsClick.findByIdAndUpdate(campaignsClickID, {clicked: true, date: moment().toISOString()});
  }
}

module.exports = updateCampaignsClick;
