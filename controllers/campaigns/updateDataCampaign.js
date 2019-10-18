const DelayedDispatch = require('../../DB/models/delayedDispatch');
const Campaign = require('../../DB/models/campaign');

function sendJSONResponse(res, status, data) {
  res.status(status);
  if (data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } else
    res.send();
}


async function updateDataCampaign(req, res) {
  try {

    const updateData = {};

    if (req.body.statusOfShipments)
      if (req.body.statusOfShipments === 'ongoing')
        updateData.statusOfShipments = 'suspended';
      else
        updateData.statusOfShipments = 'ongoing';

    const updatedCampaign = await Campaign.findByIdAndUpdate({_id: req.params.id}, updateData, {new: true});
    const updatedDelayed = await DelayedDispatch.findOneAndUpdate({campaignId: req.params.id}, updateData, {new: true});

    const objectError = {
      error: {
        id: 'unable-to-send-campaign',
        message: `We were unable to send campaign to subscribers`
      }
    };

    const isStatusOfShipments = updatedCampaign.statusOfShipments !== req.body.statusOfShipments &&
      updatedDelayed.statusOfShipments !== req.body.statusOfShipments;

    if (isStatusOfShipments)
      sendJSONResponse(res, 200, updatedCampaign);
    else
      sendJSONResponse(res, 500, objectError);
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = updateDataCampaign;
