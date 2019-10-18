const Filters = require('../../DB/models/filter');

function saveNewFilter(req, res, next) {
  const { label, language, region, subscriptionDate, browser, os, isNew } = req.body;
  Filters.find({ userId: req.user.id, label: label })
  .then(filters => {
    if (filters.length && isNew) throw { message: 'duplicated label' };
    if (!filters.length && isNew) {
      const newFilter = new Filters({
        label,
        language,
        region,
        subscriptionDate,
        browser,
        os,
        userId: req.user.id
      });
      return newFilter.save();
    } else {
      const filter = filters[0];
      filter.label = label ? label: filter.label;
      filter.region = region ? region: filter.region;
      filter.browserLang = language ? language: filter.language;
      filter.subscriptionDate = subscriptionDate ? subscriptionDate : filter.subscriptionDate;
      filter.browsers = browser ? browser : filter.browser;
      filter.platform = os ? os : filter.os;
      return filter.save();
    }
  })
  .then(() => res.send({ done: true }))
  .catch(err => next(err));
}

module.exports = saveNewFilter;
