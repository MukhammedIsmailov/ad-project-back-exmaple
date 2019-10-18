const Sites = require('../DB/models/sites');
const express = require('express');
const router = express.Router();
const controllers = require('../controllers');
const passport = require('passport');
const axios = require('axios');
const dns = require('dns');
const url = require('url');

const authRouter = require('./authRouter');
const statisticRouter = require('./statisticRouter');
const uploadRouter = require('./uploadRouter');
const userRouter = require('./userRoutes');
const filtersRouter = require('./filtersRouter');
const automationsRouter = require('./automationsRouter');
const servicesRouter = require('./servicesRouter');

const campaignsRouter = require('./campaigns/campaignsRouter');

// /api

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/statistic', statisticRouter);
router.use('/upload', uploadRouter);
router.use('/automation', automationsRouter);
router.post('/subscribe', controllers.subscribe);
router.post('/send-push', passport.authenticate('jwt', {session: false}), controllers.sendPush);
router.use('/filters', filtersRouter);
router.use('/services', servicesRouter);
router.use('/campaigns', campaignsRouter);
router.use('/update-ip', controllers.updateIPSubscriber);

router.use('/test', (req, res) => {
  const {url} = req.query;
  Sites.find({url}, (err, site) => {
    if (err) throw err;
    if (site.length) res.send({error: 'site is already exist'});
    else axios.get(url)
      .then(response => {
        if (response.status === 200) res.send({success: true});
        else res.status(404).send({error: 'site is not valid or unavailable now'})
      })
      .catch(err => res.status(404).send({error: 'invalid url'}))
  })
});

router.get('/test-service', (req, res) => {
  try {
    const {url} = req.query;
    const serviceURL = new URL(`http://${url}`);

    dns.resolve(serviceURL.host, (error, address, family) => {
      if (address && address.length) {
        res.send({success: true});
      } else {
        if (error) {
          res.status(404).send({error: 'Invalid url'})
        } else {
          res.status(404).send({error: 'Site is not valid or unavailable now'})
        }
      }
    });
  } catch (error) {
    res.status(500).send({error: 'Something went wrong'})
  }
});

module.exports = router;
