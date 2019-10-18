const triggerPushMsg = require('../triggerPushMsg');
const { add: addNewCronJob } = require('../CronMananger');
const CronJob = require('cron').CronJob;
const Automation = require('../../DB/models/automation');

function createDelayedPush({ date, currentNotification, subscriber, websiteId, automationId, indexOfCurrentPushMsg, totalPushMsgs }) {
  const onTick = (onComplete) => {
    const { title, body, url, icon } = currentNotification;
    const data = {
      title,
      body,
      icon,
      data: { redirectUrl: url },
    };
    const isLastPushMsg = indexOfCurrentPushMsg === totalPushMsgs - 1;

    triggerPushMsg(subscriber, JSON.stringify(data), websiteId)
    .then(() => onComplete(true, isLastPushMsg))
  };
  const onComplete = (isComplete, isLastPushMsg) => {
    // isComplete need because onComplete triggers if job is stopped by command job.stop()
    const updateObj = {
      $inc: { pushSent: 1 }
    };
    if (isLastPushMsg) {
      updateObj.$inc.completed = 1;
      updateObj.$inc.queue = -1;
    }
    if (isComplete) Automation.findByIdAndUpdate(automationId, updateObj).exec()
  };
  const newCronJob = {
    cron: new CronJob(date.toDate(), onTick, onComplete, true),
    automationId,
  };
  addNewCronJob(newCronJob);
}

module.exports = createDelayedPush;
