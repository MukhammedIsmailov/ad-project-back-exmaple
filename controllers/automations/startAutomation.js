const Automation = require('../../DB/models/automation');
const Subscribers = require('../../DB/models/subscriber/subscriber');
const moment = require('moment');
const createDelayedPush = require('./createDelayedPush');

/**
 *
 * @param automationId
 * @param subscriberId
 * @returns {Promise<void>}
 */
async function startAutomation(automationId, subscriberId) {
  const automation = await Automation.findById(automationId).exec();
  const subscriber = await Subscribers.findById(subscriberId).exec();
  if (automation && subscriber) {
    const notifications = [...automation.notifications];
    const subscriptionDate = moment(subscriber.date);
    let notificationsForSend = [];
    const firstNotice = notifications[0];
    const immediately = firstNotice.delayedTime.immediately;

    if (!immediately) {
      //timeShift will be ['n','shift'] shift = 'hours' | 'days' | 'minutes'
      const firstTimeShift = firstNotice.delayedTime.after.split(' ');
      const firstNotificationDate = moment(subscriptionDate).add(parseInt(firstTimeShift[0]), firstTimeShift[1]);
      const notificObj = {
        date: firstNotificationDate,
        notification: firstNotice
      };
      notificationsForSend.push(notificObj);
    } else {
      const notificObj = {
        date: moment().add(1, 'minutes'),
        notification: firstNotice
      };
      notificationsForSend.push(notificObj);
    }

    //make dates for all notifications.
    for (let i = 1; i < notifications.length; ++i) {
      const timeShift = notifications[i].delayedTime.after.split(' ');
      const notificationDate = moment(notificationsForSend[i - 1].date).add(parseInt(timeShift[0]), timeShift[1]);
      const notificObj = {
        date: notificationDate,
        notification: notifications[i]
      };
      notificationsForSend.push(notificObj);
    }

    const validNotification = notificationsForSend.filter(item => item.date.isAfter(moment()));

    if (validNotification.length) {
      validNotification.forEach((item, index) => {
        const objForDelayedPush = {
          date: item.date,
          currentNotification: item.notification,
          subscriber,
          websiteId: automation.id_of_site,
          automationId: automation._id,
          indexOfCurrentPushMsg: index,
          totalPushMsgs: validNotification.length
        };
        createDelayedPush(objForDelayedPush);
      });
      automation.update({ $inc: { queue: 1 } }).exec()
    }
  }
}

module.exports = startAutomation;


