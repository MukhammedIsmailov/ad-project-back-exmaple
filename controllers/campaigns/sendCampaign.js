const moment = require('moment');

const getSubscriptionsFromDatabase = require('../subscribers/getSubscriptionsFromDatabase');

const Campaign = require('../../DB/models/campaign');

const saveCampaignToDatabase = require('./saveCampaignToDatabase');
const generateCampaignNotifications = require('./generateCampaignNotifications');
const createAndSendCampaignNow = require('./createAndSendCampaignNow');

const saveDelayedDispatchToDatabase = require('../delayed/saveDelayedDispatchToDatabase');

function sendJSONResponse(res, status, data) {
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

async function sendCampaignWithDelay(res, dataToSendWithDelay, objectError) {

  const {dataToSend, websiteId, serviceId, campaignId, subscribers, delayedDate, arrayDelayedDates} = dataToSendWithDelay;

  Campaign.findOneAndUpdate(campaignId, {
    sent: subscribers.length,
    deliveryFailed: subscribers.length,
    status: 'waiting',
  }, {new: true});

  const dataDelayed = {
    type: 'campaign',
    status: 'pending',
    websiteId: websiteId,
    campaignId: campaignId,
    pushData: dataToSend,
    serviceId: serviceId,
    statusOfShipments: 'ongoing',
  };

  if (arrayDelayedDates) // if there are no intervals
    dataDelayed.delayDates = arrayDelayedDates;
  else
    dataDelayed.delayDates = [delayedDate];

  const newDelayed = await saveDelayedDispatchToDatabase(dataDelayed);

  if (newDelayed) {
    sendJSONResponse(res, 200, {newCampaign: null, statusShowCampaign: false, data: {success: true}});
  } else {
    sendJSONResponse(res, 500, objectError);
  }
}


async function selectTypeOfShipmentCampaign(req, res, selectTypeData) {

  const {
    newCampaignID,
    selectedSiteID,
    selectedServiceID,
    generateCampaignData,
    duplicateCount,
    delayedDate,
    numberIntervals,
    objectError
  } = selectTypeData;

  const {subscribersHasUA: subscribers} = generateCampaignData;

  const dataToSend = {duplicateCount, generateCampaignData};

  const dataToSendWithDelay = {
    dataToSend,
    websiteId: selectedSiteID,
    serviceId: selectedServiceID,
    campaignId: newCampaignID,
    subscribers,
    delayedDate,
  };

  if (delayedDate && !numberIntervals) {

    dataToSendWithDelay.arrayDelayedDates = null; // if there are no intervals

    sendCampaignWithDelay(res, dataToSendWithDelay, objectError);

  } else if (numberIntervals) {

    dataToSendWithDelay.arrayDelayedDates = setIntervals(numberIntervals, delayedDate);

    sendCampaignWithDelay(res, dataToSendWithDelay, objectError, generateCampaignData);

  } else {

    const pushNotifications = await generateCampaignNotifications(generateCampaignData, newCampaignID, selectedServiceID);

    if (pushNotifications.length) {

      const dataForCreatingCampaign = {selectedSiteID, pushNotifications, subscribers, duplicateCount};

      const updatedCampaign = await Campaign.findByIdAndUpdate(newCampaignID, {
        pushNotifications,
        sent: Number(subscribers.length * duplicateCount),
        deliveryFailed: Number(subscribers.length * duplicateCount),
        statusOfShipments: 'completed',
        status: 'sent',
      }, {new: true}).exec();

      const sendNotification = await createAndSendCampaignNow(dataForCreatingCampaign);
      const foundSuccess = sendNotification.some(status => 199 > status < 300);

      if (foundSuccess) {
        sendJSONResponse(res, 200, {newCampaign: updatedCampaign, statusShowCampaign: true, data: {success: true}});
      } else {
        sendJSONResponse(res, 500, objectError);
      }
    } else {
      sendJSONResponse(res, 204, {message: 'no-content'});
    }
  }
}

async function sendCampaign(req, res) {
  try {
    const userID = req.user._id;
    const {duplicateCount, delayedDate, numberIntervals, selectedSiteID, selectedService} = req.body;
    const selectedServiceID = selectedService._id;

    const objectError = {
      error: {
        id: 'unable-to-send-campaign',
        message: `We were unable to send campaign to subscribers`
      }
    };

    const {newCampaignID, newCampaignServiceQuery} = await saveCampaignToDatabase(selectedService, selectedSiteID, userID);
    const subscribers = await getSubscriptionsFromDatabase(selectedSiteID, null);

    const subscribersHasUA = subscribers.reduce((acc, item) => {
      if (item.ua !== undefined) {
        acc.push(item);
      }
      return acc;
    }, []);

    if (subscribersHasUA.length !== 0) {

      const generateCampaignData = {userID, campaignServiceQuery: newCampaignServiceQuery, subscribersHasUA};

      const selectTypeData = {
        newCampaignID,
        selectedSiteID,
        selectedServiceID,
        generateCampaignData,
        duplicateCount,
        delayedDate,
        numberIntervals,
        objectError
      };

      selectTypeOfShipmentCampaign(req, res, selectTypeData);

    } else {
      sendJSONResponse(res, 500, objectError);
    }
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = sendCampaign;
