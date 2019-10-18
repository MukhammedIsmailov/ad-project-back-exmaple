const Notifications = require('../../DB/models/notifications');

/**
 * Update notification depending on arguments.
 * If status should change - the second argument should be null
 * @param id
 * @param [upload]
 * @param [status]
 * @returns {Promise}
 */

function updateNotification(id, upload, status) {
  if (status) return Notifications.findByIdAndUpdate(id, { status }).exec();
  else {
    const field = upload === 'delivered' ? 'deliveredCount' : 'clickCount';
    let updateObj = {
      $inc: { [field]: 1 }
    };
    if (upload === 'delivered') updateObj.$inc.deliveryFailed = -1;
    return Notifications.findByIdAndUpdate(id, updateObj).exec();
  }
}

module.exports = updateNotification;
