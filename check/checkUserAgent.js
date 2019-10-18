const mongoose = require('mongoose');
const webpush = require('web-push');
const path = require('path');
const ua = require('useragent-generator');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const Subscriber = require('../DB/models/subscriber/subscriber');

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

//connect to db
mongoose.connect('mongodb://localhost:27017/elmarproject', {
  useNewUrlParser: true
}, function (err) {
  if (err) throw err;
  console.log('Successfully connected from user agent');
});

function randomInteger(min, max) {
  let randomNumber = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNumber);
}

function generateUserAgent() {
  const browsers = ['chrome', 'firefox'];
  const devices = ['', 'androidPhone', 'androidTablet'];

  const browser = browsers[randomInteger(0, 1)];
  const device = devices[randomInteger(0, 2)];
  let browserVersion = null;

  if (browser === 'chrome') {
    browserVersion = randomInteger(50, 71);
  } else {
    browserVersion = randomInteger(50, 56);
  }

  if (device) {
    return ua[browser][device](browserVersion);
  } else {
    return ua[browser](browserVersion);
  }
}

const check = async () => {

  const subscribersWithoutUA = await Subscriber.find({
    'ua': {'$exists': false}
  }, '_id', {lean: true});

  if (subscribersWithoutUA && subscribersWithoutUA.length) {
    subscribersWithoutUA.forEach(async subscriber => {
      const id = subscriber._id;
      const ua = generateUserAgent();
      Subscriber.findByIdAndUpdate(id, {ua})
    });
  } else {
    console.log('All subscribers has ua')
  }
};

check();
