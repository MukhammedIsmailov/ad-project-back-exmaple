const createPushMsgChain = require('../../helpers/createChainOfPushMsg');
const updateCampaign = require('./updateCampaign');

async function createAndSendCampaignNow(dataCampaigns) {

  const {selectedSiteID, pushNotifications, subscribers, duplicateCount, campaignId} = dataCampaigns;

  const subscribersWithPushNotificationsData = subscribers.map(subscriber => {
    for (let i = 0; i < pushNotifications.length; i += 1) {
      if (String(subscriber._id) === String(pushNotifications[i].subscriberId)) {
        return {subscriber, pushNotification: pushNotifications[i].dataNotification};
      }
    }
  });

  const pushMsgChainArray = [];

  subscribersWithPushNotificationsData.forEach(subscriberWithPush => {
    if (subscriberWithPush !== undefined) {
      for (let k = 0; k < duplicateCount; k++) {
        pushMsgChainArray.push(
          createPushMsgChain([subscriberWithPush.subscriber], subscriberWithPush.pushNotification, selectedSiteID)
            .then(res => {
              updateCampaign(campaignId, null, 'sended');
              if (res && res.statusCode)
                return res.statusCode;
              else
                return 413;
            })
            .catch(err => console.log(err))
        )
      }
    }
  });

  return Promise.all(pushMsgChainArray);
}

module.exports = createAndSendCampaignNow;
