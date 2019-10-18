const User = require('../../DB/models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function changeUserPassword(req, res, next) {
  const userID = req.user.id;
  const { oldPassword, newPassword } = req.body;

  User.findById(userID)
  .then(async user => {
    const isCompared = await bcrypt.compare(oldPassword, user.password);
    if (isCompared) {
      return new Promise(resolve => {
        bcrypt.hash(newPassword, saltRounds, function (err, hash) {
          user.password = hash;
          resolve(user.save());
        });
      });
    }
    else res.send({ error: 'incorrect old password' });
  })
  .then(() => res.send({ done: true }))
  .catch(() => next(new Error('some problems with changing password')));
}

module.exports = changeUserPassword;
