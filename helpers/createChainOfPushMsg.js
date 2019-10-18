const triggerPushMsg = require('../controllers/triggerPushMsg');

/**
 *
 * @param subscriptions
 * @param dataToSend
 * @param websiteID
 * @returns {Promise<void>}
 */
function createPushMsgChain(subscriptions, dataToSend, websiteID) {
  let promiseChain = Promise.resolve();

  for (let i = 0; i < subscriptions.length; i += 1) {
    const subscription = subscriptions[i];
    promiseChain = promiseChain.then(() => {
      return triggerPushMsg(subscription, JSON.stringify(dataToSend), websiteID);
    });
  }

  return promiseChain;
}

module.exports = createPushMsgChain;
