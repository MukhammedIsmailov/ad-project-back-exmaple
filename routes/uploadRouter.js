const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const passport = require('passport');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../uploads'),
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname + '.png');
  }
});

const upload = multer({
  storage,
  limits: { fieldSize: 25 * 1024 * 1024 }
});

router.post('/', passport.authenticate('jwt', { session: false }), upload.any(),
  function (req, res, next) {
  let fileName = req.files[0].path.split('/');
  fileName = fileName[fileName.length - 1];
  const data = {
    filePath: `${process.env.BASE_URL}uploads/${fileName}`
  };
  if (req.files[1]) {
    let iconName = req.files[1].path.split('/');
    iconName = iconName[iconName.length - 1];
    data.iconPath = `${process.env.BASE_URL}uploads/${iconName}`
  }
  res.send(data)
  });

module.exports = router;
