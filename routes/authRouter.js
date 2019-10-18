const express = require('express');
const router = express.Router();
const passport = require('passport');
const controllers = require('../controllers');
const { sendToken } = require('../helpers');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
        return next();
    } else {
      return res.status(404).send({ error: info.message });
    }
  })(req, res, next);
}, sendToken);

router.post('/register', controllers.registration);

module.exports = router;
