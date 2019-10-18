const Filters = require('../../DB/models/filter');

function deleteFilter(req, res, next) {
  const id = req.params.id;

  Filters.findByIdAndDelete(id).exec()
  .then(() => res.send({ done: true }))
  .catch(err => next(err));
}

module.exports = deleteFilter;
