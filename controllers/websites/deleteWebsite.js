const Sites = require('../../DB/models/sites');
const Users = require('../../DB/models/users');
const Notifications = require('../../DB/models/notifications');
const fs = require('fs');
const path = require('path');

/**
 * Delete web site and its notifications, icon, swRegistrator
 * @param req
 * @param res
 * @param next
 */
function deleteWebsite(req, res, next) {
  const { id } = req.query;

  try {
    Sites.findById(id)
      .then(site => {
        if (site) {
          let iconFileName = site.icon.split('/');
          iconFileName = iconFileName[iconFileName.length - 1];
          if (iconFileName !== 'default-web-icon.png') {
            fs.unlink(path.resolve(__dirname, `../../uploads/${iconFileName}`), (err) => {
              if (err) throw err;
            })
          }
          let linkForSWRegistrator = site.linkForSWRegistrator.split('/');
          linkForSWRegistrator = linkForSWRegistrator[linkForSWRegistrator.length - 1];
          fs.unlink(path.resolve(__dirname, `../../public/javascripts/swRegistrators/${linkForSWRegistrator}`), (err) => {
            if (err) throw err;
          });

          Notifications.deleteMany({ _id: { $in: site.notifications } });

          Sites.findByIdAndDelete(site._id).exec()
            .then(() => {
              Users.findByIdAndUpdate(req.user.id, { $pull: { websites: site._id } }).exec()
                .then(() => res.send({ done: 'true' }))
            });
        } else res.send({ done: 'false', message: 'we did not found website' })
      });
  } catch (e) {
    throw e;
  }

}

module.exports = deleteWebsite;
