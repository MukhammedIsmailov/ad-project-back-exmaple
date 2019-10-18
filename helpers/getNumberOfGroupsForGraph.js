function getNumberOfGroupsForGraph(period, group) {
  if (period === 'quarter' && group === 'day') return 90;
  if (period === 'quarter' && group === 'week') return 13;
  if (period === 'month' && group === 'day') return 30;
  if (period === 'week' && group === 'day') return 7;
  else return 4;
}

module.exports = getNumberOfGroupsForGraph;
