const Subscribers = require('../../DB/models/subscriber/subscriber');
const Sites = require('../../DB/models/sites');
const createLog = require('../statistic/createLog');

async function unsubscribe(id, websiteID) {
  await Subscribers.updateOne({ _id: id }, { unsubscribeDate: new Date() });
  await Sites.findById(websiteID)
  .then(site => createLog(site, 'unsubscribe'))
}

module.exports = unsubscribe;
