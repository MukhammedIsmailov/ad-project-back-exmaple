const express = require('express');
const router = express.Router();
const passport = require('passport');
const controllers = require('../../controllers');

const checkAuthenticate = passport.authenticate('jwt', { session: false });

router.post('/send-push', checkAuthenticate, controllers.sendPush);

module.exports = router;
