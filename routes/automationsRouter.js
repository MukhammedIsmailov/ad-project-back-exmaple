const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const passport = require('passport');

router.post('/', passport.authenticate('jwt', { session: false }), controllers.createAutomation);
router.get('/all', passport.authenticate('jwt', { session: false }), controllers.getAllAutomations);
router.get('/:id', passport.authenticate('jwt', { session: false }), controllers.getAutomationById);
router.patch('/run-automation/:id', passport.authenticate('jwt', { session: false }), controllers.runAutomation);
router.patch('/stop-automation/:id', passport.authenticate('jwt', { session: false }), controllers.stopAutomation);
router.patch('/edit-automation/:id', passport.authenticate('jwt', { session: false }), controllers.editAutomation);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controllers.deleteAutomation);

module.exports = router;
