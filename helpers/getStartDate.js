const moment = require('moment');

function getStartDate(period) {
  return period === 'yesterday' ? moment().subtract(1, 'days') : period === 'week' ? moment().subtract(7, 'days') : period === 'month' ? moment().subtract(30, 'days') : moment();
}

module.exports = getStartDate;
