const Notifications = require('../../DB/models/notifications');
const Sites = require('../../DB/models/sites');

async function saveNotificationToDatabase({ id, notification: { title, body, image, url, icon } }, userID) {
  const { url: websiteUrl, icon: websiteIcon } = await Sites.findById(id, 'url icon');
  const notification = {
    userID,
    websiteId: id,
    websiteUrl,
    title,
    body,
    image,
    icon: icon ? icon : websiteIcon,
    url,
    date: new Date().toUTCString(),
    deliveredCount: 0,
    clickCount: 0
  };

  return new Promise(function (resolve, reject) {
    Notifications.create(notification, function (err, newDoc) {
      if (err) {
        reject(err);
        return;
      }

      resolve(newDoc._id);
    });
  });
}

module.exports = saveNotificationToDatabase;
