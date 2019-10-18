function generateGraphColumnCount(period) {
  return period === 'yesterday' || period === 'today' ? 24 : period === 'week' ? 7 : 30;
}

module.exports = generateGraphColumnCount;
