const Notifications = require('../../DB/models/notifications');

function getNotificationStatisticByID(req, res, next) {
  const id = req.params.id;

  Notifications.findById(id)
  .then(notification => res.send(notification))
  .catch(err => next(err))
}

module.exports = getNotificationStatisticByID;


