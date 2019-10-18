const CampaignsClick = require('../../DB/models/campaignsClick');
const countriesCodes = require('../../helpers/countries-codes');
const geoip = require('geoip-lite');
const moment = require('moment');

async function saveCampaignsClicksToDatabase(userID, subscriberIP, serviceID, campaignID) {
  const region = await geoip.lookup(subscriberIP);
  const ISO2 = region.country; // ISO2 - standard short name of country: Uganda - UG
  const country = countriesCodes[ISO2];

  if(ISO2 && country){
    const newCampaignsClick = {
      userID,
      ISO2,
      country,
      serviceID,
      campaignID,
      subscriberIP,
      clicked: false,
      delivered: false,
      sent: true,
      date: moment().toISOString()
    };

    await CampaignsClick.create(newCampaignsClick);
  }
}

module.exports = saveCampaignsClicksToDatabase;
