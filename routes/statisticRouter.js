const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const passport = require('passport');

router.post('/', controllers.updateStatistic);
router.get('/analytics', passport.authenticate('jwt', { session: false }), controllers.getAnalyticsStatistic);
router.get('/notification/:id',passport.authenticate('jwt', { session: false }), controllers.getNotificationStatisticByID);
router.get('/website/:id', passport.authenticate('jwt', { session: false }), controllers.getWebsiteStatisticByID);

module.exports = router;
