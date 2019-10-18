const updateNotification = require('../notifications/updateNotification');
const updateCampaign = require('../campaigns/updateCampaign');
const updateCampaignsClick = require('../campaigns_clicks/updateCampaignsClick');

async function updateStatistic(req, res) {
  const {statisticAction} = req.body;

  if (statisticAction && req.body.notificationID) {
    updateNotification(req.body.notificationID, statisticAction)
      .then(() => {
        res.status(200).send()
      });

  } else {
    res.status(204).send()
  }

  if (statisticAction && req.body.campaignID) {

    if(req.body.subscriberIP){
      const {subscriberIP, campaignID} = req.body;

      await updateCampaignsClick(statisticAction, campaignID, subscriberIP);
    }

    updateCampaign(req.body.campaignID, statisticAction)
      .then(() => {
        res.status(200).send()
      });

  } else {
    res.status(204).send()
  }
}

module.exports = updateStatistic;

