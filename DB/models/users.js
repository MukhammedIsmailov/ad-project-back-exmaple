const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
  fullName: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: Array,
  phone: String,
  websites: [{ type: Schema.Types.ObjectId, ref: 'Sites' }],
  avatar: String,
});

const users = mongoose.model('Users', Users);

module.exports = users;
