const express = require('express');
const router = express.Router();
const controller = require('../../controllers');
const passport = require('passport');

router.get('/profile', passport.authenticate('jwt', { session: false }),controller.getUserInfo);
router.post('/profile', passport.authenticate('jwt', { session: false }), controller.changeUserInfo);
router.post('/change-password', passport.authenticate('jwt', { session: false }), controller.changeUserPassword);

router.post('/save-website', passport.authenticate('jwt', { session: false }), controller.saveWebsiteToDatabase);
router.post('/change-website-information', passport.authenticate('jwt', { session: false }), controller.saveWebsiteInfoChanges);
router.delete('/delete-website', passport.authenticate('jwt', { session: false }),  controller.deleteWebsite);
router.get('/website-integration-info', passport.authenticate('jwt', { session: false }), controller.getIntegrationInfo);

router.delete('/delete-subscriber', passport.authenticate('jwt', { session: false }), controller.deleteSubscriber);

router.get('/common-statistics', passport.authenticate('jwt', { session: false }), controller.getCommonStatistic);
router.get('/notification-statistics', passport.authenticate('jwt', { session: false }), controller.getCommonNotificationsStatistic);
router.get('/notifications', passport.authenticate('jwt', { session: false }), controller.getNotifications);

module.exports = router;
