const Sites = require('../../DB/models/sites');

function getIntegrationInfo(req, res, next) {
  if (req.query.id) {
    Sites.findById(req.query.id)
    .populate([{ path: 'subscribers', select: 'date browser os language unsubscribeDate region.country region.region region.city ip' }])
    .then(website => res.send({ website }))
    .catch(err => res.send({ error: 'not valid id' }));
  }
}

module.exports = getIntegrationInfo;
