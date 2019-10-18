const saveSubscriptionToDatabase = require('./saveSubscriberToDatabase');
const Sites = require('../../DB/models/sites');
const createLog = require('../statistic/createLog');
const Automation = require('../../DB/models/automation');
const startAutomation = require('../automations/startAutomation');

async function subscribe(req, res, next) {
  try {
    const SubscribersIp = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    // Check the request body has at least an endpoint.
    const isValidSubscribeRequest = () => {
      if (!req.body || !req.body.subscription.endpoint) {
        // Not a valid subscription.
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'no-endpoint',
            message: 'Subscription must have an endpoint.',
          },
        }));
        return false;
      }
      return true;
    };

    if (isValidSubscribeRequest()) {
      const {_id: subscriptionId} = await saveSubscriptionToDatabase(req.body, SubscribersIp);
      const site = await Sites.findById(req.body.appID);

      if (site) {
        if (!site.subscribers.filter(item => item.toString() === subscriptionId.toString()).length) {
          await site.updateOne({$push: {subscribers: subscriptionId}}).exec();
          createLog(site, 'new');

          const automations = await Automation.find({id_of_site: site._id});

          if (automations) {
            if (automations.length) automations.forEach(async item => {
              const lastIndex = item.subscribersArray.length - 1;
              item.subscribersArray.set(lastIndex + 1, subscriptionId);
              const {_id: savedItem} = await item.save();
              if (savedItem) {
                startAutomation(item._id, subscriptionId)
              }
            });

            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({data: {success: true, subscriberID: subscriptionId, subscriberIP: SubscribersIp}}));
          }
        }
      } else {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'unable-to-save-subscription',
            message: 'The subscription was received but we were unable to save it to our database.',
          },
        }));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = subscribe;
