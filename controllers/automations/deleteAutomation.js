const Automation = require('../../DB/models/automation');
const { stopJobs } = require('../CronMananger');

function deleteAutomation(req, res, next) {
  const id = req.params.id;

  stopJobs(id);

  Automation.findByIdAndDelete(id).exec()
  .then(() => res.send({ done: true }))
  .catch(err => next(err));
}

module.exports = deleteAutomation;
