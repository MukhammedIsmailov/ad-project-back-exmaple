const Subscriber = require('../../DB/models/subscriber/subscriber');
const Sites = require('../../DB/models/sites');

async function updateSiteSubscribers(id, siteSubscribers) {
  try {
    const subscriptionFilter = {
      _id: {$in: siteSubscribers},
      $or: [{unsubscribeDate: {$exists: false}}, {unsubscribeDate: {$eq: null}}],
    };

    const subscribedSubscribers = await Subscriber.find(subscriptionFilter).exec();

    if (siteSubscribers.length !== subscribedSubscribers.length)
      Sites.findByIdAndUpdate(id, {
        subscribers: subscribedSubscribers
      }).exec();
  } catch (error) {
    console.log(error);
  }
}

function getSubscriptionsFromDatabase(id, filter) {
  return Sites.findById(id)
    .then(site => {
      const filterForDB = {
        _id: {$in: site.subscribers},
        $or: [{unsubscribeDate: {$exists: false}}, {unsubscribeDate: {$eq: null}}],
      };
      for (let key in filter) {
        // if filter[key].length = 0 it means get "any"
        if (filter[key] instanceof Array && filter[key].length) filterForDB[key] = {$in: filter[key]};
      }
      delete filterForDB.subscriptionDate;
      delete filterForDB.region;

      if (filter && filter.region.length) {
        filterForDB['region.country'] = {$in: filter.region};
      }
      if (filter && filter.subscriptionDate) filterForDB.date = {
        $gte: new Date(filter.subscriptionDate[0]),
        $lt: new Date(filter.subscriptionDate[1]),
      };

      updateSiteSubscribers(id, site.subscribers);

      return Subscriber.find(filterForDB).exec();
    });
}

module.exports = getSubscriptionsFromDatabase;
