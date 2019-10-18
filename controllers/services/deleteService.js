const Service = require('../../DB/models/service/service');

function sendJSONResponse(res, status, data) {
  res.status(status);
  if (data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } else
    res.send();
}

async function deleteService(req, res) {
  try {
    const deleteService = await Service.remove({_id: req.params.id});

    const objectError = {
      error: {
        id: 'unable-to-send-campaign',
        message: `We were unable to send campaign to subscribers`
      }
    };

    if (deleteService.ok)
      sendJSONResponse(res, 200, deleteService);
    else
      sendJSONResponse(res, 500, objectError);
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = deleteService;

