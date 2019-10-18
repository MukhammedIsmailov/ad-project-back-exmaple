const Automation = require('../../DB/models/automation');
const { stopJobs } = require('../CronMananger');

function stopAutomation(req, res, next) {
  const automationId = req.params.id;

  Automation.findByIdAndUpdate(automationId, { status: 'cancelled' })
  .then(() => stopJobs(automationId))
  .then(() => res.send({ done: true }))
  .catch(err => next(err))

}

module.exports = stopAutomation;
