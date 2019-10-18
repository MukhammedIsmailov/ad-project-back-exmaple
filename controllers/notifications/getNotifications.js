const User = require('../../DB/models/users');
const Sites = require('../../DB/models/sites');
const Notifications = require('../../DB/models/notifications');

function getNotifications(req, res, next) {
  const userID = req.user.id;
  let notificationsArray = [];

  User.findById(userID)
  .populate('websites')
  .then(user => {
    if (user.websites.length) {
      const promises = user.websites.map(item => {
        // get statistic of each website
        return new Promise((resolve, reject) => Sites.findById(item)
          .populate('notifications')
          .then(site => {
            if (site) {
              let promises = site.notifications.map(item => {
                // get statistic of each notification which match date
                return new Promise((resolve) => Notifications.find({ _id: item }, (err, notifications) => {
                  notifications.forEach((notification) => {
                    notificationsArray.push(notification)
                  });
                  resolve();
                }))
              });
              Promise.all(promises)
                .then(() => resolve())
            }
            else resolve();
          })
        )
      });

      Promise.all(promises)
        .then(() => res.send(notificationsArray))
        .catch(err => {
          throw err
        })
    } else {
      res.send({success: true, message: 'notifications not found'});
    }
  })
}

module.exports = getNotifications;
