const Automation = require('../../DB/models/automation');
const startAutomation = require('./startAutomation');
const { stopJobs } = require('../CronMananger');
const ACTIVE_AUTOMATION = 'ActiveAutomation';

function runAutomation(req, res, next) {
  const id = req.params.id;

  Automation.findByIdAndUpdate(id, { status: 'active' }).exec()
  .then(automation => {
    if (automation === null) throw new Error('no such automation');
    else if (automation.status === 'active') {
      let error = new Error('automation is run already');
      error.name = ACTIVE_AUTOMATION;
      throw error;
    }
    else {
      const promiseArr = [];
      automation.subscribersArray.forEach(item => promiseArr.push(startAutomation(automation._id, item)));
      return Promise.all(promiseArr);
    }
  })
  .then(() => res.send({ done: true }))
  .catch(async err => {
    if (err.kind === 'ObjectId') res.send({ success: false, message: 'not valid automation ID' });
    else if (err.name === ACTIVE_AUTOMATION) res.send({ success: false, message: err.message });
    else {
      stopJobs(id);
      await Automation.findByIdAndUpdate(id, { status: 'cancelled' }).exec();
      next(err);
    }
  });
}

module.exports = runAutomation;
