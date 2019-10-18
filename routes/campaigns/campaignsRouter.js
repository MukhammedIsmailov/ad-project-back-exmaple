const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../../controllers');

const checkAuthenticate = passport.authenticate('jwt', { session: false });

router.get('/', checkAuthenticate, controller.getCampaignsFromDatabase);
router.post('/send-campaign', checkAuthenticate, controller.sendCampaign);
router.put('/update-campaign/:id', checkAuthenticate, controller.updateDataCampaign);
router.delete('/delete-campaign/:id', checkAuthenticate, controller.deleteCampaign);

module.exports = router;
