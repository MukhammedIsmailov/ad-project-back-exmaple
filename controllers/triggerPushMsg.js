const webpush = require('web-push');
const unsubscribe = require('./subscribers/unsubscribeSubscriber');

/**
 *
 * @param subscription
 * @param dataToSend
 * @param websiteID
 * @returns {Promise|*|Promise<T | never>}
 */
function triggerPushMsg (subscription, dataToSend, websiteID) {
  const options = {
    TTL: 2419200
  };
  return webpush.sendNotification(subscription, dataToSend, options)
    .catch((err) => {
      /**
       * statusCode === 404 Not Found. This is an indication that the subscription is expired and can't be used.
       * In this case you should delete the `PushSubscription` and wait for the client to resubscribe the user.
       *
       * statusCode === 410 Gone. The subscription is no longer valid and should be removed from application server.
       * This can be reproduced by calling `unsubscribe()` on a `PushSubscription`.
       */
      if (err.statusCode === 410 || err.statusCode === 404) {
        return unsubscribe(subscription._id, websiteID);
      } else {
        console.log('Subscription is no longer valid: ', err);
      }
    });
}

module.exports = triggerPushMsg;
