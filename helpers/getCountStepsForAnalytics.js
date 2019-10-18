function getCountStepsForAnalytics(period, group) {
  if (period === 'day' && group === 'hour') return 24;
  if (period === 'day' && group === 'day') return 1;
  if (period === 'week' && group === 'hour') return 168;
  if (period === 'week' && group === 'day') return 7;
  else return 30;
}

module.exports = getCountStepsForAnalytics;
