const User = require('../../DB/models/users');

function changeUserInfo(req, res, next) {
  const userID = decodeURI(req.query.id);
  const options = {
    new : true
  };

  User.findByIdAndUpdate(userID, req.body, options, (err, user) => {
    if (err) return res.status(400).send(err);

    if (user !== null) {
      const userInfo = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      };
      return res.send(userInfo)
    }
    else return res.status(404).send({ message : 'User not found'})

  })
}

module.exports = changeUserInfo;
