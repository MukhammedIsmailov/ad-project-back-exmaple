const Service = require('../../DB/models/service/service');
const subscriberFields = require('../../DB/models/subscriber/subscriberFields');
const serviceFields = require('../../DB/models/service/serviceFields');

function sendJSONResponse(res, status, data) {
  res.status(status);
  if (data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } else
    res.send();
}

async function saveServiceToDatabase(req, res) {
  try {
    const userID = req.user._id;
    const {name, url, query, subscriberFields, notificationFields} = req.body;

    const serviceData = {
      userID,
      name,
      url,
      query,
      subscriberFields,
      notificationFields
    };

    const objectError = {
      error: {
        id: 'unable-to-create-service',
        message: `Service no created`
      }
    };

    const newService = await Service.create(serviceData);

    if (newService._id)
      sendJSONResponse(res, 200, newService);
    else {
      sendJSONResponse(res, 500, objectError);
    }
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = saveServiceToDatabase;
