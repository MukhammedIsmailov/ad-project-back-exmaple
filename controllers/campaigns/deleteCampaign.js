const DelayedDispatch = require('../../DB/models/delayedDispatch');
const Campaign = require('../../DB/models/campaign');

function sendJSONResponse(res, status, data) {
  res.status(status);
  if (data) {
    res.set('Content-Type', 'application/json');
    res.send(data);
  } else
    res.send();
}


async function deleteCampaign(req, res) {
  try {
    const deleteCampaign = await Campaign.remove({_id: req.params.id});
    const deleteDelayedDispatch = await DelayedDispatch.remove({campaignId: req.params.id});

    const objectError = {
      error: {
        id: 'unable-to-delete-campaign',
        message: `We were unable to delete campaign`
      }
    };

    if (deleteCampaign.ok && deleteDelayedDispatch.ok)
      sendJSONResponse(res, 200);
    else
      sendJSONResponse(res, 500, objectError);
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = deleteCampaign;
