module.exports = {
  endpoint: {
    type: String,
    unique: true,
  },
  expirationTime: String,
  keys: {
    auth: String,
    p256dh: String
  },
  date: Date,
  browser: String,
  os: String,
  language: String,
  unsubscribeDate: Date,
  region: {
    range: Array,
    country: String,
    region: String,
    eu: String,
    timezone: String,
    city: String,
    li: Array,
    metro: Number,
    area: Number
  },
  ip: String,
  operator: String,
  ua: {
    type: String,
    required: false,
    default: ''
  }
};
