module.exports = {
  userID: String,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  url: String,
  query: String,
  subscriberFields: Object,
  notificationFields: {
    title: String,
    description: String,
    image: String,
    icon: String,
    redirectUrl: String
  }
};
