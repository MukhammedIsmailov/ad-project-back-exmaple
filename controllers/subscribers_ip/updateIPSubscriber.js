const Subscriber = require('../../DB/models/subscriber/subscriber');
const countriesCodes = require('../../helpers/countries-codes');
const geoip = require('geoip-lite');

async function updateIPSubscriber(req, res) {
  const {ip, id} = req.query;
  const region = await geoip.lookup(ip);

  const updatingData = {
    ip
  };

  if(region && region.country){
    updatingData.region = region;
  }

  Subscriber.findByIdAndUpdate(id, updatingData)
    .then(() => res.send());
}

module.exports = updateIPSubscriber;
