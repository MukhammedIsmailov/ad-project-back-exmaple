const Sites = require('../../DB/models/sites');
const Users = require('../../DB/models/users');
const helpers = require('../../helpers/index');
const mongoose = require('mongoose');

function saveWebsiteToDatabase(req, res, next) {
  const { url, icon } = req.body;

  const id = mongoose.Types.ObjectId();
  const site = new Sites({
    _id: id,
    url: url,
    icon: icon || `${process.env.BASE_URL}public/images/default-web-icon.png`,
    linkForSWRegistrator: helpers.generateSWRegistrator(id),
    linkForSW: `${process.env.BASE_URL}static/service-worker.js`
  });

  try {
    Sites.create(site, function (err, newDoc) {
      if (err) {
        res.send(err);
        return;
      }
      Users.findByIdAndUpdate(req.user._id, { $push: { websites: newDoc._id }}, ()=> {
        res.send({websiteID: newDoc._id})
      })
    });
  } catch (e) {
    throw e;
  }

}

module.exports = saveWebsiteToDatabase;
