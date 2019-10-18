const Websites = require('../../DB/models/sites');
const moment = require('moment');
const {generateGraphColumnCount, getStartDate} = require('../../helpers');

function getWebsiteStatisticByID(req, res, next) {
  const id = req.params.id;
  const {period} = req.query;
  if (!id || !period) return res.status(400).send({error: 'incorrect one of id | group | period'});

  Websites.findById(id)
    .populate('subscribers notifications')
    .then(website => {
      let data = {
        url: website.url,
        allSubscribers: website.subscribers.length,
        newSubscribersCount: null,
        campaigns: website.notifications.length,
        unsubscribeCount: null,
        dataForGraph: [],
      };

      website.subscribers.forEach(item => {
        if (moment(item.date).isSame(moment(), 'day')) ++data.newSubscribersCount;
        if (item.unsubscribeDate) ++data.unsubscribeCount;
      });
      const graphCount = generateGraphColumnCount(period);
      const logsSlice = website.logs.slice(-graphCount);

      if (period === 'week' || period === 'month') {
        for (let i = 0, start = getStartDate(period); i <= graphCount; ++i) {
          const logOfDay = logsSlice.find(item => moment(item.date).isSame(start, 'day'));
          if (!logOfDay) {
            const logsBefore = website.logs.filter(item => moment(item.date).isBefore(start.hours(0)));
            const lastLog = logsBefore[logsBefore.length - 1];
            const totalCounter = lastLog ? lastLog.total : website.subscribers.reduce((counter, item) => moment(item.date).isBefore(start) ? ++counter : counter, 0);

            data.dataForGraph.push({
              date: start.toDate(),
              total: totalCounter,
              new: 0,
              unsubscribed: 0,
            });
            start = moment(start).add(1, 'days');
            continue;
          }
          let column = {
            date: start.toDate(),
            ...logOfDay,
          };
          data.dataForGraph.push(column);
          start = moment(start).add(1, 'days');
        }
      } else {
        let totalCounter = 0;
        const date = getStartDate(period);
        const logOfDay = logsSlice.find(item => {
          return moment(item.date).isSame(date, 'day');
        });
        if (logOfDay) {
          totalCounter = logOfDay.total - logOfDay.new + logOfDay.unsubscribed;
        } else {
          const logsBefore = website.logs.filter(item => moment(item.date).isBefore(date.hours(0)));
          const lastLog = logsBefore.length ? logsBefore[logsBefore.length - 1] : false;
          totalCounter = lastLog ? lastLog.total : 0;

        }
        const periodsInADay = moment.duration(1, 'day').as('hours');
        const startTimeMoment = moment(date).hours(0).minutes(0);
        const endTimeMoment = moment().hours(0).minutes(59);
        // totalCounter = logOfDay ? logOfDay.total : logOfDayIndex !== 0 ? logsSlice[logOfDayIndex - 1].total : 0;

        for (let i = 0; i <= periodsInADay; i += 1) {
          const newCount = logOfDay ? logOfDay.newTimes.reduce((counter, item) => moment(item).isSame(startTimeMoment, 'hour') ? ++counter : counter, 0) : 0;
          const unsubscribeCount = logOfDay ? logOfDay.unsubscribedTimes.reduce((counter, item) => moment(item).isSame(startTimeMoment, 'hour') ? ++counter : counter, 0) : 0;
          totalCounter = totalCounter + newCount - unsubscribeCount;
          let column = {
            date: startTimeMoment.format(),
            total: totalCounter,
            new: newCount,
            unsubscribed: unsubscribeCount,
          };
          data.dataForGraph.push(column);
          startTimeMoment.add(1, 'hours');
          endTimeMoment.add(1, 'hours');
        }
      }
      res.send(data);
    })
    .catch(err => next(err));
}

module.exports = getWebsiteStatisticByID;
