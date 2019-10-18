const Campaign = require('../../DB/models/campaign');

/**
 * Update campaign depending on arguments.
 * If status should change - the second argument should be null
 * @param id
 * @param [upload]
 * @param [status]
 * @returns {Promise}
 */

function updateCampaign(id, upload, status) {
  if (status) return Campaign.findByIdAndUpdate(id, { status }).exec();
  else {
    const field = upload === 'delivered' ? 'deliveredCount' : 'clickCount';
    let updateObj = {
      $inc: { [field]: 1 }
    };
    if (upload === 'delivered') updateObj.$inc.deliveryFailed = -1;
    return Campaign.findByIdAndUpdate(id, updateObj).exec();
  }
}

module.exports = updateCampaign;
