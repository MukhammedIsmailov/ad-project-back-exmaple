const moment = require('moment');

const saveNotificationToDatabase = require('./notifications/saveNotificationToDatabase');
const getSubscriptionsFromDatabase = require('./subscribers/getSubscriptionsFromDatabase');
const createPushMsgChain = require('../helpers/createChainOfPushMsg');
const Notifications = require('../DB/models/notifications');
const addNotificationIdIntoWebsite = require('./websites/addNotificationIdIntoWebsite');

const saveDelayedDispatchToDatabase = require('./delayed/saveDelayedDispatchToDatabase');


function sendJSONResponse(req, res, status, data) {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}

function setIntervals(numberIntervals, delayedDate) {
  const arrayIntervals = [];

  const oneDay = moment.duration(1, 'day').asMilliseconds();
  const timeInterval = Math.floor(oneDay / numberIntervals);

  let delayedDateInSeconds = null;

  if (delayedDate)
    delayedDateInSeconds = Number(Date.parse(delayedDate));
  else
    delayedDateInSeconds = Date.now();

  for (let i = 0; i < numberIntervals; i += 1) {
    arrayIntervals.push(new Date(delayedDateInSeconds).toISOString());
    delayedDateInSeconds += timeInterval;
  }

  return arrayIntervals;
}

async function sendNotificationWithDelay(req, res, dataToSendWithDelay, objectError) {
  const {websiteId, dataToSend, subscriptions, delayedDate, arrayDelayedDates} = dataToSendWithDelay;

  Notifications.findByIdAndUpdate(dataToSend.data.notificationID, {
    sended: subscriptions.length,
    status: 'waiting',
    delayedDate,
    subscribersArray: subscriptions,
  }).exec();

  const dataDelayed = {
    type: 'notification',
    status: 'pending',
    websiteId: websiteId,
    pushData: dataToSend,
    campaignId: null,
    statusOfShipments: 'ongoing',
  };

  if (arrayDelayedDates)
    dataDelayed.delayDates = arrayDelayedDates;
  else
    dataDelayed.delayDates = [delayedDate];

  const newDelayed = await saveDelayedDispatchToDatabase(dataDelayed);

  if (newDelayed) {
    sendJSONResponse(req, res, 200, {data: {success: true}});
  } else {
    sendJSONResponse(req, res, 500, objectError);
  }
}

async function sendPush(req, res) {
  try {
    const {id: websiteId} = req.body;
    const {title, body, image, url, icon, delayedDate, duplicateCount, numberIntervals} = req.body.notification;

    const dataToSend = {
      title,
      body,
      icon,
      image,
      duplicateCount,
      data: {redirectUrl: url},
    };

    const idOfNotification = await saveNotificationToDatabase(req.body, req.user.id);
    dataToSend.data.notificationID = idOfNotification;
    const site = await addNotificationIdIntoWebsite(websiteId, idOfNotification);
    if (!url) dataToSend.data.redirectUrl = site.url;
    const subscriptions = await getSubscriptionsFromDatabase(websiteId, req.body.filter);

    const objectError = {
      error: {
        id: 'unable-to-send-messages',
        message: `We were unable to send messages to all subscriptions`
      }
    };

    if (delayedDate && !numberIntervals) {

      const dataToSendWithDelay = {
        websiteId,
        dataToSend,
        subscriptions,
        delayedDate,
        arrayDelayedDates: null
      };

      sendNotificationWithDelay(req, res, dataToSendWithDelay, objectError);

    } else if (numberIntervals) {

      const arrayDelayedDates = setIntervals(numberIntervals, delayedDate);

      const dataToSendWithDelay = {
        websiteId,
        dataToSend,
        subscriptions,
        delayedDate,
        arrayDelayedDates
      };

      sendNotificationWithDelay(req, res, dataToSendWithDelay, objectError);

    } else {

      Notifications.findByIdAndUpdate(dataToSend.data.notificationID, {
        sended: subscriptions.length * duplicateCount,
        deliveryFailed: subscriptions.length * duplicateCount,
        status: 'sended',
      }).exec();

      const pushMsgChainsArray = [];

      for (let i = 0; i < duplicateCount; i += 1) {
        pushMsgChainsArray.push(
          createPushMsgChain(subscriptions, dataToSend, websiteId)
            .then(res => res.statusCode)
            .catch(err => console.log(err))
        )
      }

      const sendNotificationStatuses = await Promise.all(pushMsgChainsArray);

      const foundSuccess = sendNotificationStatuses.some(status => 199 > status < 300);

      if (foundSuccess)
        sendJSONResponse(req, res, 200, {data: {success: true}});
      else
        sendJSONResponse(req, res, 500, objectError);

    }
  } catch
    (err) {
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        message: `'${err.message}'`,
      },
    }));
  }
}

module.exports = sendPush;
