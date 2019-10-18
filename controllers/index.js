// main
const sendPush = require('./sendPush');
const registration = require('./register');

// automation's
const createAutomation = require('./automations/createAutomation');
const createDelayedPush = require('./automations/createDelayedPush');
const deleteAutomation = require('./automations/deleteAutomation');
const editAutomation = require('./automations/editAutomation');
const getAllAutomations = require('./automations/getAllAutomations');
const getAutomationById = require('./automations/getAutomationById');
const runAutomation = require('./automations/runAutomation');
const startAutomation = require('./automations/startAutomation');
const stopAutomation = require('./automations/stopAutomation');

// campaigns
const createAndSendCampaignNow = require('./campaigns/createAndSendCampaignNow');
const deleteCampaign = require('./campaigns/deleteCampaign');
const generateCampaignNotifications = require('./campaigns/generateCampaignNotifications');
const getCampaignsFromDatabase = require('./campaigns/getCampaignsFromDatabase');
const saveCampaignToDatabase = require('./campaigns/saveCampaignToDatabase');
const sendCampaign = require('./campaigns/sendCampaign');
const updateCampaign = require('./campaigns/updateCampaign');
const updateDataCampaign = require('./campaigns/updateDataCampaign');

// delayed
const saveDelayedDispatchToDatabase = require('./delayed/saveDelayedDispatchToDatabase');

// filters
const getAllFilters = require('./filters/getAllFilters');
const saveNewFilter = require('./filters/saveNewFilter');
const deleteFilter = require('./filters/deleteFilter');

//notifications
const getNotifications = require('./notifications/getNotifications');
const saveNotificationToDatabase = require('./notifications/saveNotificationToDatabase');
const updateNotification = require('./notifications/updateNotification');

// services

const getServices = require('./services/getServices');
const saveServiceToDatabase = require('./services/saveServiceToDatabase');
const deleteService = require('./services/deleteService');

// statistic
const createLog = require('./statistic/createLog');
const getAnalyticsStatistic = require('./statistic/getAnalyticsStatistic');
const getCommonNotificationsStatistic = require('./statistic/getCommonNotificationsStatistic');
const getCommonStatistic = require('./statistic/getCommonStatistic');
const getNotificationStatisticByID = require('./statistic/getNotificationStatisticByID');
const getWebsiteStatisticByID = require('./statistic/getWebsiteStatisticByID');
const updateStatistic = require('./statistic/updateStatistic');

// subscribers
const deleteSubscriber = require('./subscribers/deleteSubscriber');
const getSubscriptionsFromDatabase = require('./subscribers/getSubscriptionsFromDatabase');
const saveSubscriptionToDatabase = require('./subscribers/saveSubscriberToDatabase');
const subscribe = require('./subscribers/subscribe');
const unsubscribe = require('./subscribers/unsubscribeSubscriber');

// subscribers_ip
const updateIPSubscriber = require('./subscribers_ip/updateIPSubscriber');

// user
const changeUserInfo = require('./user/changeUserInfo');
const changeUserPassword = require('./user/changeUserPassword');
const getUserInfo = require('./user/getUserInfo');

// websites
const addNotificationIdIntoWebsite = require('./websites/addNotificationIdIntoWebsite');
const deleteWebsite = require('./websites/deleteWebsite');
const getIntegrationInfo = require('./websites/getIntegrationInfo');
const saveWebsiteInfoChanges = require('./websites/saveWebsiteInfoChanges');
const saveWebsiteToDatabase = require('./websites/saveWebsiteToDatabase');

module.exports = {
  sendPush, // main
  registration,

  createAutomation, // automation's
  createDelayedPush,
  deleteAutomation,
  editAutomation,
  getAllAutomations,
  getAutomationById,
  runAutomation,
  startAutomation,
  stopAutomation,

  createAndSendCampaignNow, // campaigns
  deleteCampaign,
  generateCampaignNotifications,
  getCampaignsFromDatabase,
  saveCampaignToDatabase,
  sendCampaign,
  updateCampaign,
  updateDataCampaign,

  saveDelayedDispatchToDatabase, // delayed

  getAllFilters, // filters
  saveNewFilter,
  deleteFilter,

  getNotifications, // notifications
  saveNotificationToDatabase,
  updateNotification,

  getServices, // services
  saveServiceToDatabase,
  deleteService,

  createLog, // statistic
  getAnalyticsStatistic,
  getCommonNotificationsStatistic,
  getCommonStatistic,
  getNotificationStatisticByID,
  getWebsiteStatisticByID,
  updateStatistic,

  deleteSubscriber, // subscribers
  getSubscriptionsFromDatabase,
  saveSubscriptionToDatabase,
  subscribe,
  unsubscribe,

  updateIPSubscriber, // subscribers_ip

  changeUserInfo, // user
  changeUserPassword,
  getUserInfo,

  addNotificationIdIntoWebsite, // websites
  deleteWebsite,
  getIntegrationInfo,
  saveWebsiteToDatabase,
  saveWebsiteInfoChanges,
};
