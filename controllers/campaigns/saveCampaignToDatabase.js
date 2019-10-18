const getSubscriptionsFromDatabase = require('../subscribers/getSubscriptionsFromDatabase');
const Campaign = require('../../DB/models/campaign');
const Sites = require('../../DB/models/sites');

async function createNewCampaign(campaignData) {

  return new Promise(function (resolve, reject) {
    Campaign.create(campaignData, function (err, newCampaign) {
      if (err) {
        reject(err);
        return;
      }

      resolve({newCampaignID: newCampaign._id, newCampaignServiceQuery: newCampaign.serviceQuery});
    });
  });
}

async function saveCampaignToDatabase(service, websiteID, userID) {

  const {url: websiteUrl, icon: websiteIcon} = await Sites.findById(websiteID, 'url icon');
  const subscribersArray = await getSubscriptionsFromDatabase(websiteID, null);

  const campaignData = {
    userID,
    websiteID,
    websiteUrl,
    websiteIcon,
    serviceID: service._id,
    serviceUrl: service.url,
    serviceQuery: service.query,
    date: new Date(),
    sent: 0,
    statusOfShipments: 'ongoing',
    subscribersArray,
    deliveredCount: 0,
    clickCount: 0
  };

  return createNewCampaign(campaignData)
    .then(campaign => campaign)
    .catch(err => console.log(err));
}

module.exports = saveCampaignToDatabase;
