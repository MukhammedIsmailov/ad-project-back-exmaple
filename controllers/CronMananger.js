/**
 * Global automations. It's need for stop cronJob in future.
 * @type {Array}
 */

let automationsArr = [];

const add = (newCronJob) => {
  automationsArr.push(newCronJob);
};

const stopJobs = (automationId) => {
  automationsArr = automationsArr.filter(item => {
    if (item.automationId === automationId) {
      item.cron.stop();
      return false
    } else return true;
  })
};

module.exports = {
  add,
  stopJobs,
};
