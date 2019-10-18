const DelayedDispatch = require('../../DB/models/delayedDispatch');

async function saveDelayedDispatchToDatabase(data, campaignQuery) {
  try {
    const {type, status, websiteId, pushData, campaignId, delayDates, serviceId, statusOfShipments} = data;

    const newDelayed = {
      type,
      status,
      websiteId,
      delayDates
    };

    if (pushData) newDelayed.pushData = pushData;

    if (campaignId) newDelayed.campaignId = campaignId;

    if (serviceId) newDelayed.serviceId = serviceId;

    if (campaignQuery) newDelayed.campaignQuery = campaignQuery;

    if (statusOfShipments) newDelayed.statusOfShipments = statusOfShipments;

    const createdDelayed = await DelayedDispatch.create(newDelayed);

    return createdDelayed ? createdDelayed : null;

  } catch (error) {
    console.log(error)
  }
}

module.exports = saveDelayedDispatchToDatabase;
