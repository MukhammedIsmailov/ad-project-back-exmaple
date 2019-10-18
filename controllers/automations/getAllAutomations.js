const Automation = require('../../DB/models/automation');

function getAllAutomations(req, res, next) {
  Automation.find({ userId: req.user.id })
  .then(automations => {
    res.send(automations);
  })
  .catch(err => next(err));
}

module.exports = getAllAutomations;
