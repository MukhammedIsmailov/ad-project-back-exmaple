const User = require('../../DB/models/users');
const Sites = require('../../DB/models/sites');
const Notifications = require('../../DB/models/notifications');

async function getCommonStatistic(req, res, next) {
  try {

    const userID = req.user.id;

    let commonStatistic = {
      websites: [],
      campaigns: null,
      subscribers: null,
      sended: null,
      delivered: null,
      clicked: null,
    };

    const user = await User.findById(userID).populate('websites');

    if (user.websites.length) {

      for (let i = 0; i < user.websites.length; i++) {

        const site = await Sites.findById(user.websites[i], '-logs -__v')
          .populate([
            {path: 'notifications', select: 'deliveredCount clickCount sended date'},
            {path: 'subscribers', select: 'os browser language ip region.country date operator'}
          ]);

        if (site) {

          if (site && site.subscribers.length) {
            commonStatistic.subscribers += site.subscribers.length;
          }
          if (site && site.notifications.length) commonStatistic.campaigns += site.notifications.length;
          site.notifications.forEach(item => {
            commonStatistic.delivered += item.deliveredCount || null;
            commonStatistic.clicked += item.clickCount || null;
            commonStatistic.sended += item.sended || null;
          });

          commonStatistic.websites.push(site);
        }
      }

      res.send(commonStatistic);

    } else {
      res.send(commonStatistic);
    }
  } catch (error) {
    res.status(500).message(error.message);
    res.send();
  }
}

module.exports = getCommonStatistic;
