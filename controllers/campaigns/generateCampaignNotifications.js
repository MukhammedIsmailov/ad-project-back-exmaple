const axios = require('axios');
const querystring = require('querystring');
const Service = require('../../DB/models/service/service');
const saveCampaignsClicksToDatabase = require('../campaigns_clicks/saveCampaignsClicksToDatabase');

function checkSubscriberFields(obj) {
  return Boolean(Object.keys(obj).length);
}

async function createGetRequest(userID, serviceEndpoint, subscribersHasUA, service, campaignID) {
  try {
    const arrayGetRequests = [];
    const subscriberFields = service.subscriberFields;
    const isSubscriberFieldsEmpty = checkSubscriberFields(subscriberFields);

    for await (let subscriber of subscribersHasUA) {
      const subscriberIP = subscriber.ip;

      const query = {
        content_type: 'json'
      };

      if (isSubscriberFieldsEmpty) {
        Object.entries(subscriberFields).forEach(field => {
          const [key, value] = field;
          if (value.indexOf('.') === -1) {
            query[key] = encodeURI(subscriber[value]);
          } else {
            const keyOfValue = subscriber[value.split('.')[0]];
            query[key] = encodeURI(keyOfValue[value.split('.')[1]]);
          }
        });
      }

      await saveCampaignsClicksToDatabase(userID, subscriberIP, service._id, campaignID);

      const requestUrl = serviceEndpoint + querystring.stringify(query);

      arrayGetRequests.push(axios.get(requestUrl)
        .then(res => {
          return {res: res, subscriberId: subscriber._id.toString(), subscriberIP: subscriber.ip}
        })
        .catch(err => console.log(err))
      );
    }

    return arrayGetRequests;
  } catch (error) {
    console.log(error);
  }
}

async function generateCampaignNotifications(generateCampaignData, campaignID, serviceID) {
  try {
    const service = await Service.findById(serviceID);
    const notificationFields = service.notificationFields;

    const {userID, campaignServiceQuery, subscribersHasUA} = generateCampaignData;

    const serviceEndpoint = `${campaignServiceQuery}`;
    const arrayGetRequests = await createGetRequest(userID, serviceEndpoint, subscribersHasUA, service, campaignID);
    const newCampaign = await Promise.all(arrayGetRequests);

    return newCampaign.reduce((acc, item) => {

      const dataNotifications = item.res.data;
      if (dataNotifications !== undefined && dataNotifications.length) {
        const notificationFromService = dataNotifications[0];

        const notification = Object.entries(notificationFields).reduce((acc, field) => {
          const [key, value] = field;
          if (key !== '$init') {
            if (key !== 'redirectUrl') {
              acc[key] = notificationFromService[value];
            } else {
              if (acc.data === undefined) {
                acc.data = {};
                acc.data[key] = notificationFromService[value];
              } else {
                acc.data[key] = notificationFromService[value];
              }
            }
          }
          return acc;
        }, {});

        notification.body = notification.description;

        if (notification.data === undefined) {
          notification.data = {campaignID: campaignID, subscriberID: item.subscriberId, subscriberIP: item.subscriberIP};
          if (notification.link !== undefined)
            notification.data.redirectUrl = notification.link;
        } else {
          notification.data.campaignID = campaignID;
          notification.data.subscriberID = item.subscriberId;
          notification.data.subscriberIP = item.subscriberIP;
        }

        acc.push({dataNotification: notification, subscriberId: item.subscriberId})
      }
      return acc;
    }, []);
  } catch (error) {
    console.log(error);
  }
}

module.exports = generateCampaignNotifications;
