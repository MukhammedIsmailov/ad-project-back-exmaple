const Subscriber = require('../../DB/models/subscriber/subscriber');
const geoip = require('geoip-lite');
const whoismyispname = require('whoismyispname');

async function getOperatorNameByIP(ip) {
  try {
    const provider = await whoismyispname(ip);
    return provider ? provider : null;
  } catch (error) {
    console.log(error.message)
  }
}

/**
 *
 * @param subscription
 * @param rest
 * @param ip
 * @returns {Promise}
 */

async function saveSubscriptionToDatabase({subscription, ...rest}, ip) {
  try {
    const subscribers = await Subscriber.find({endpoint: subscription.endpoint});

    if (subscribers.length === 1) {

      const subscriber = subscribers[0];

      const isSubscriberNotChanged = () => {
        return Boolean(
          subscriber.browser === rest.browser &&
          subscriber.os === rest.os &&
          subscriber.language === rest.language &&
          subscriber.ua === rest.ua &&
          subscriber.ip === ip
        );
      };

      if (!isSubscriberNotChanged()) {
        subscriber.unsubscribeDate = null;

        const region = geoip.lookup(ip);
        const operator = await getOperatorNameByIP(ip);
        const updatedSubscriber = {
          browser: rest.browser,
          os: rest.os,
          language: rest.language,
          ua: rest.ua,
          ip,
          operator,
          region
        };

        const updatedFields = Object.keys(updatedSubscriber).reduce((accum, key) => {
          if (updatedSubscriber[key] !== subscriber[key]) {
            accum.push(key);
          }
          return accum;
        }, []);

        const subscriberToSave = updatedFields.reduce((accum, key) => {
          accum[key] = updatedSubscriber[key];
          return accum;
        }, subscriber);

        return subscriberToSave.save();

      } else {
        // TODO: POST /api/subscribe 500
        return subscriber;
      }
    } else if (subscribers.length > 1) new Error("duplicate");
    else {
      const region = geoip.lookup(ip);
      const operator = await getOperatorNameByIP(ip);
      const subscriber = new Subscriber({
        ...rest,
        ...subscription,
        date: new Date(),
        ip,
        region,
        operator,
      });

      const createdUser = await Subscriber.create(subscriber);

      return createdUser ? createdUser : null;
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = saveSubscriptionToDatabase;
