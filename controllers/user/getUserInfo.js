const User = require('../../DB/models/users');

function getUserInfo(req, res, next) {
  const userID = decodeURI(req.query.id);

  User.findById(userID, 'fullName email phone avatar', (err, user) => {
    if (err) return res.status(400).send(err);

    if (user !== null) {
      return res.send(user)
    }
    else return res.status(404).send({ message : 'User not found'})

  })
}

module.exports = getUserInfo;
