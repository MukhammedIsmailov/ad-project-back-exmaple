const Sites = require('../../DB/models/sites');

function saveWebsiteInfoChanges(req, res, next) {
  Sites.findById(req.query.id)
  .then(site => {
    site.icon = req.body.icon;
    return site.save();
  })
  .then(() => res.send({ done: true }))
  .catch(err => next(err));
}

module.exports = saveWebsiteInfoChanges;
