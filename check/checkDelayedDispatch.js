const mongoose = require('mongoose');
const webpush = require('web-push');
const moment = require('moment');
const path = require('path');
const util = require('util');

require('dotenv').config({path: path.join(__dirname, '../.env')});

const DelayedDispatch = require('../DB/models/delayedDispatch');
const Notifications = require('../DB/models/notifications');
const Campaign = require('../DB/models/campaign');

const {
  generateCampaignNotifications,
  createAndSendCampaignNow,
  updateNotification,
  getSubscriptionsFromDatabase
} = require('../controllers');

const createPushMsgChain = require('../helpers/createChainOfPushMsg');

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//connect to db
mongoose.connect('mongodb://localhost:27017/elmarproject', {
  useNewUrlParser: true
}, function (err) {
  if (err) throw err;
  console.log('Successfully connected cronJobs');
});

const sendNotification = async (job) => {
  const {pushData, websiteId} = job;
  const notificationId = pushData.data.notificationID;

  const notification = await Notifications.findOne({_id: notificationId}, '-_id subscribersArray', {lean: true});
  const subscribers = notification.subscribersArray;
  const pushMsgChainsArray = [];

  await Notifications.findByIdAndUpdate(notificationId, {
    sended: subscribers.length * pushData.duplicateCount,
    status: 'waiting',
    subscribersArray: subscribers,
    deliveryFailed: subscribers.length * pushData.duplicateCount
  }).exec();

  if (subscribers.length) {
    for (let i = 0; i < pushData.duplicateCount; i += 1) {
      pushMsgChainsArray.push(
        createPushMsgChain(subscribers, pushData, websiteId)
          .then(res => {
            updateNotification(notificationId, null, 'sended');
            return res.statusCode;
          })
          .catch(err => console.log(err))
      )
    }

    return await Promise.all(pushMsgChainsArray);
  } else
    return null;
};

const sendCampaign = async (job) => {
  const {pushData, websiteId: selectedSiteID, campaignId, serviceId} = job;
  const duplicateCount = pushData.duplicateCount;
  const generateCampaignData = pushData.generateCampaignData;
  const subscribers = await getSubscriptionsFromDatabase(selectedSiteID, null);
  const subscribersHasUA = subscribers.reduce((acc, item) => {
    if (item.ua !== undefined) {
      acc.push(item);
    }
    return acc;
  }, []);

  generateCampaignData.subscribersHasUA = subscribersHasUA;

  const pushNotifications = await generateCampaignNotifications(generateCampaignData, campaignId, serviceId);

  if (pushNotifications.length) {

    const dataForCreatingCampaign = {selectedSiteID, pushNotifications, subscribers: subscribersHasUA, duplicateCount, campaignId};

    await Campaign.findByIdAndUpdate(campaignId, {
      subscribersArray: subscribers,
      pushNotifications,
      sent: Number(subscribersHasUA.length * duplicateCount),
      deliveryFailed: Number(subscribersHasUA.length * duplicateCount)
    }, {new: true});

    return await createAndSendCampaignNow(dataForCreatingCampaign);
  }
};

const dropDelayDate = (resultsStatuses, delayDates) => {
  if (resultsStatuses) {
    const foundSuccess = resultsStatuses.some(status => 199 > status < 300);

    if (foundSuccess) {
      return delayDates.reduce((accum, delayDate, index) => {
        if (index !== 0)
          accum.push(delayDate);
        return accum;
      }, [])
    }
  }
};

const check = async () => {
  const oneMinute = moment.duration(1, 'minute').asMilliseconds();

  const types = {
    notification: (dataSend) => {
      return sendNotification(dataSend);
    },
    campaign: (dataSend) => {
      return sendCampaign(dataSend);
    }
  };

  const delayed = await DelayedDispatch.find({
    status: 'pending',
    statusOfShipments: 'ongoing',
    delayDates: {
      $lte: moment().toISOString()
    }
  }).exec();

  delayed.forEach(async (job) => {

    const {
      _id,
      type,
      websiteId,
      campaignId,
      pushData,
      delayDates,
      serviceId
    } = job;

    DelayedDispatch.findByIdAndUpdate({_id}, {status: 'sending'}).exec();

    const dataForSend = {pushData: pushData, websiteId: websiteId};

    if (campaignId)
      dataForSend.campaignId = campaignId;

    if (serviceId)
      dataForSend.serviceId = serviceId;

    const result = await types[type](dataForSend);

    const newDelayDates = dropDelayDate(result, delayDates);

    if (newDelayDates && !newDelayDates.length) {
      DelayedDispatch.findByIdAndDelete(_id).exec();
      if (campaignId)
        Campaign.findByIdAndUpdate(campaignId, {statusOfShipments: 'completed'}).exec();
    } else {
      DelayedDispatch.findByIdAndUpdate({_id}, {status: 'pending', delayDates: newDelayDates}).exec();
    }
  });

  setTimeout(check, oneMinute);
};

check();
