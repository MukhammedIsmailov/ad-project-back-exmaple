const Filters = require('../../DB/models/filter');

function getAllFilters(req, res, next) {
  Filters.find({ userId: req.user._id }, { __v: 0})
  .then(filters => res.send(filters))
  .catch(err => next(err));
}

module.exports = getAllFilters;
