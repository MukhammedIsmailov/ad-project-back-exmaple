const Service = require('../../DB/models/service/service');
const subscriberSchemeFields = require('../../DB/models/subscriber/subscriberFields');
const serviceSchemeFields = require('../../DB/models/service/serviceFields');

function getFieldsKey(object) {
  const stacked = [object];
  const result = [];
  const noInformationFields = ['unique', 'required', 'type', 'default', 'date'];

  for (; ;) {
    if (!stacked.length) break;

    const field = stacked.pop();

    Object.entries(field).forEach((item) => {
      const [key, value] = item;
      const isInformationField = noInformationFields.some(field => field === key) &&
        String(value) !== 'function Array() { [native code] }';

      if (!isInformationField) {
        if (typeof field[key] !== 'object') {
          result.push(key);
        } else if (key === 'ua'){
          result.push(key);
        }
      }

      if (typeof field[key] === 'object') {

        Object.keys(field[key]).forEach(objectKey => {

          const isInformationObjectKey = noInformationFields.some(field => field === objectKey);
          if (!isInformationObjectKey) {
            result.push(`${key}.${objectKey}`)
          }
        })
      }
    });
  }

  return result;
}

async function getServices(req, res) {
  try {
    const userID = req.user.id;
    const services = await Service.find({userID});

    const serviceFields = getFieldsKey(serviceSchemeFields.notificationFields);
    const subscriberFields = getFieldsKey(subscriberSchemeFields);

    subscriberFields.push('_id');

    res.send({servicesInfo: services, serviceFields, subscriberFields});
  } catch (error) {
    res.status(500).json({message: 'Services not founded'})
  }
}

module.exports = getServices;
