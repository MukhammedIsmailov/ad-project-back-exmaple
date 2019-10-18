const Automation = require('../../DB/models/automation');
const Sites = require('../../DB/models/sites');
const startAutomation = require('./startAutomation');

async function createAutomation(req, res, next) {
  const { websiteId, label, notifications, status, browserLang = 'any' } = req.body;
  const automation = new Automation({
    id_of_site: websiteId,
    label,
    completed: 0,
    pushSent: 0,
    queue: 0,
    status: status,
    notifications,
    userId: req.user.id,
    createdAt: new Date(),
  });

  await Sites.findById(websiteId).populate('subscribers')
  .then(site => {
    automation.websiteUrl = site.url;
    automation.subscribersArray = browserLang.toLowerCase() === 'any' ? site.subscribers : site.subscribers.filter(item => item.language === browserLang);
    automation.browserLang = browserLang;
    return automation.save();
  })
  .then(automation => {
    const promiseArr = [];
    if (status === 'active') automation.subscribersArray.forEach(item => promiseArr.push(startAutomation(automation._id, item)));
    return Promise.all(promiseArr);
  })
  .then(() => res.send({ done: true }))
  .catch(err => next(err));
}

module.exports = createAutomation;
