const express = require('express');
const router = express.Router();
const passport = require('passport');
const { getAllFilters, saveNewFilter, deleteFilter } = require('../controllers');

router.get('/', passport.authenticate('jwt', { session: false }), getAllFilters);
router.post('/save', passport.authenticate('jwt', { session: false }), saveNewFilter);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteFilter);

module.exports = router;
