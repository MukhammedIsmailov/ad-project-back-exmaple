const Campaign = require('../../DB/models/campaign');

function sendJSONResponse(res, status, data) {
  res.status(status);
  if (data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } else
    res.send();
}

async function getCampaignsFromDatabase(req, res, next) {
  try {
    const userID = req.user._id;

    const objectError = {
      error: {
        id: 'unable-to-delete-campaign',
        message: `We were unable to delete campaign`
      }
    };

    const campaigns = await Campaign.find({userID});

    if (campaigns) {
      sendJSONResponse(res, 200, campaigns);
    } else {
      sendJSONResponse(res, 500, objectError);
    }
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = getCampaignsFromDatabase;
