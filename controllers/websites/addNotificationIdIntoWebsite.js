const Sites = require('../../DB/models/sites');

function addNotificationIdIntoWebsite(websiteID, notificationID) {
  return Sites.findByIdAndUpdate(websiteID, { $push: { notifications: notificationID } }).exec()
}

module.exports = addNotificationIdIntoWebsite;
