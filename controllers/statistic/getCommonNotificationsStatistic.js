const User = require('../../DB/models/users');
const Sites = require('../../DB/models/sites');
const Notifications = require('../../DB/models/notifications');
const helpers = require('../../helpers');

function getCommonNotificationsStatistic(req, res, next) {
  const userID = req.user.id;
  const { group = 'day', period = 'month' } = req.query;
  const days = period === 'month' ? 30 : period === 'quarter' ? 90 : 7;
  // now many groups of statistics we need to send
  const groups = helpers.getNumberOfGroupsForGraph(period, group);
  // from which date we need find notifications
  const from = new Date();
  from.setDate(from.getDate() - days);

  let notificationStatistic = {
    campaigns: null,
    sended: null,
    delivered: null,
    clicked: null,
    graphStatistic: [],
  };

  // fill array with groups
  for (let i = 0, daysForInc = ((groups === 4 || groups === 13) ? 7 : 1), date = from; i <= groups; ++i) {
    let to = new Date(date);
    to.setDate(date.getDate() + daysForInc);
    notificationStatistic.graphStatistic.push({
      period: {
        from: date,
        to,
      },
      delivered: null,
      clicked: null,
    });
    date = to;
  }

  User.findById(userID)
  .populate('websites')
  .then(user => {
    if (user.websites.length) {
      const promises = user.websites.map(item => {
        // get statistic of each website
        return new Promise((resolve, reject) => Sites.findById(item)
          .populate('notifications subscribers')
          .then(site => {
            if (site) {
              if (site && site.subscribers.length) {
                notificationStatistic.subscribers += site.subscribers.length;
              }
              if (site && site.notifications.length) notificationStatistic.campaigns += site.notifications.length;
              let promises = site.notifications.map(item => {
                // get statistic of each notification which match date
                return new Promise((resolve) => Notifications.find({
                  _id: item,
                  date: { $gte: from },
                }, 'deliveredCount clickCount sended date', (err, notifications) => {
                  notifications.forEach((notification) => {
                    notificationStatistic.graphStatistic.forEach((item) => {
                      if (notification.date >= item.period.from && notification.date <= item.period.to) {
                        item.delivered += notification.deliveredCount || null;
                        item.clicked += notification.clickCount || null;
                      }
                    });
                    notificationStatistic.delivered += notification.deliveredCount || null;
                    notificationStatistic.clicked += notification.clickCount || null;
                    notificationStatistic.sended += notification.sended || null;
                  });
                  resolve();
                }));
              });
              Promise.all(promises)
              .then(() => resolve());
            }
            else resolve();
          }),
        );
      });

      Promise.all(promises)
      .then(() => res.send(notificationStatistic))
      .catch(err => {
        throw err;
      });
    } else res.send(notificationStatistic);
  });
}

module.exports = getCommonNotificationsStatistic;
