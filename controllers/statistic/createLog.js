const moment = require('moment');

/**
 *
 * @param site
 * @param {string} type - type of action.
 * @returns {Promise<*>}
 */
async function createLog(site, type) {
  // if log object for today not exist ---> create new

  if (!site.logs.length) {
    let log = {
      date: new Date(),
      total: 1,
      new: 1,
      unsubscribed: null,
      newTimes: [new Date()],
      unsubscribedTimes: []
    };
    await site.logs.push(log);
  }
  else if (!site.logs.some(item => moment().isSame(item.date, 'day'))) {
    const prevLogObject = site.logs[site.logs.length - 1];
    const newLog = {
      date: new Date(),
      total: type === 'new' ? prevLogObject.total + 1 : prevLogObject.total - 1,
      new: type === 'new' ? 1 : null,
      unsubscribed: type === 'unsubscribe' ? 1 : null,
      newTimes: [],
      unsubscribedTimes: []
    };
    type === 'new' ? newLog.newTimes.push(new Date()) : newLog.unsubscribedTimes.push(new Date());
    site.logs.push(newLog);
  } else {
    const prevLogObjIndex = site.logs.length - 1;
    const prevLogObj = site.logs[prevLogObjIndex];
    if (type === 'new') {
      ++prevLogObj.total;
      ++prevLogObj.new;
      prevLogObj.newTimes.push(new Date());
    } else {
      --prevLogObj.total;
      ++prevLogObj.unsubscribed;
      prevLogObj.unsubscribedTimes.push(new Date());
    }
    site.logs.set(prevLogObjIndex, prevLogObj)
  }
  // site.markModified('logs');
  return site.save();
}

module.exports = createLog;
