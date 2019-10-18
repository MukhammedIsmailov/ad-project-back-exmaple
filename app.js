const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const webpush = require('web-push');
const bodyParser = require('body-parser');
require('dotenv').config({ path: path.join(__dirname, '.env')});
require('./helpers/createDirectories');
const passport = require('passport');

const indexRouter = require('./routes/index');

require('./DB/index');
require('./passport-settings');

const app = express();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', (req, res, next) => {
  res.setHeader("Content-disposition", "attachment");
  next();
}, express.static(path.join(__dirname, 'static')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', indexRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    success: false, message: err.message, name: err.name, errors: err.errors
  });
});

module.exports = app;
