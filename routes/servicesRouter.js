const express = require('express');
const router = express.Router();
const passport = require('passport');
const {getServices, saveServiceToDatabase, deleteService} = require('../controllers');

const checkAuthenticate = passport.authenticate('jwt', {session: false});

router.get('/', checkAuthenticate, getServices);
router.post('/', checkAuthenticate, saveServiceToDatabase);
router.delete('/delete-service/:id', checkAuthenticate, deleteService);

module.exports = router;
