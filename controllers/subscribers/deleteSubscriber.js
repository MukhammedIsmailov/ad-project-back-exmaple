const Site = require('../../DB/models/sites');
const Subscribers = require('../../DB/models/subscriber/subscriber');
const Automations = require('../../DB/models/automation');

function deleteSubscriber(req, res, next) {
  const { subscriberId, websiteId } = req.query;

  Site.findByIdAndUpdate(websiteId, { $pull: { subscribers: subscriberId } })
  .then(async () => {
    await Automations.updateMany({ subscribersArray: subscriberId }, { $pull: { subscribers: subscriberId } }).exec();
    return Site.find({ subscribers: subscriberId });
  })
  .then(sites => {
    if (!sites.length) return Subscribers.findByIdAndDelete(subscriberId);
  })
  .then(() => res.send({ done: true }))
  .catch(err => next(err));
}

module.exports = deleteSubscriber;
