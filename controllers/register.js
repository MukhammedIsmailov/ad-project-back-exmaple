const User = require('../DB/models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;


function register (req, res, next) {
  let user = new User({
    fullName: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    roles: ['ADMIN']
  });
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    user.password = hash;
    user.save()
      .then(user => {
        res.status(200).send({message: "OK"})
      })
      .catch(err => {
        res.status(409).send(err)
      })
  });
}

module.exports = register;
