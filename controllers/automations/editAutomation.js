const Automation = require('../../DB/models/automation');
const Sites = require('../../DB/models/sites');
const { stopJobs } = require('../CronMananger');
const startAutomation = require('./startAutomation');

function editAutomation(req, res, next) {
  const id = req.params.id;
  const { label, notifications, status = 'cancelled', browserLang = 'any' } = req.body;

  stopJobs(id);

  Automation.findById(id).exec()
  .then(async automation => {
    if (automation === null) throw new Error('no such automation');
    else {
      automation.label = label;
      automation.notifications = notifications;
      automation.status = status;
      if (automation.browserLang !== browserLang) {
        automation.browserLang = browserLang;
        await Sites.findById(automation.id_of_site).populate('subscribers')
        .then(site => automation.subscribersArray = browserLang.toLowerCase() === 'any' ? site.subscribers : site.subscribers.filter(item => item.language === browserLang));
      }
      return automation.save();
    }
  })
  .then(automation => {
    let promiseArr = [];
    if (status === 'active') automation.subscribersArray.forEach(item => promiseArr.push(startAutomation(automation._id, item)));
    return Promise.all(promiseArr);
  })
  .then(() => res.send({ done: true }))
  .catch(async err => {
    if (err.kind === 'ObjectId') res.send({ success: false, message: 'not valid automation ID' });
    else {
      stopJobs(id);
      await Automation.findByIdAndUpdate(id, { status: 'cancelled' }).exec();
      next(err);
    }
  });
}

module.exports = editAutomation;
