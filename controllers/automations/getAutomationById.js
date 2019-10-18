const Automation = require('../../DB/models/automation');

function getAutomationById(req, res, next) {
  const id = req.params.id;
  Automation.findById(id).exec()
  .then(automation => {
    res.send(automation);
  })
  .catch(err => next(err));
}

module.exports = getAutomationById;
