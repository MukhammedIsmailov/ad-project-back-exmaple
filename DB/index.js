const mongoose = require('mongoose');

//connect to db
mongoose.connect('mongodb://localhost:27017/elmarproject',{ useNewUrlParser: true }, function (err) {
  if (err) throw err;
  console.log('Successfully connected');
});
