const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

function sendToken (req, res, next) {
  if(req.user) {
    const token = jwt.sign({_id: req.user._id}, SECRET);
    const data = {
      accessToken: token,
      roles: req.user.roles,
      id: req.user._id
    };
    return res.json(data);
  }
  return res.status(400).info;
}

module.exports = sendToken;
