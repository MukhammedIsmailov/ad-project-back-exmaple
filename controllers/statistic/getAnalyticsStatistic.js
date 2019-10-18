const Campaign = require('../../DB/models/campaign');
const CampaignsClick = require('../../DB/models/campaignsClick');
const helpers = require('../../helpers');
const moment = require('moment');

function sendJSONResponse(res, status, data) {
  res.set('Content-Type', 'application/json');
  res.status(status).send(data);
}

async function getCountriesStatistic(countriesStatisticParams) {
  const {userID, serviceID, date} = countriesStatisticParams;

  const paramsFind = {
    userID
  };

  if (serviceID !== 'r1fvb9ok2t-all-services') {
    paramsFind.serviceID = serviceID;
  }

  if (date) {
    const startAnalyticsDate = moment(date).startOf('day').toDate();
    const endAnalyticsDate = moment(date).endOf('day').toDate();
    paramsFind.date = {
      $gte: startAnalyticsDate,
      $lte: endAnalyticsDate
    }
  }

  const campaignsClicks = await CampaignsClick.find(paramsFind).exec();
  const countryStatistics = [];

  if (campaignsClicks.length) {
    campaignsClicks.forEach(campaignsClick => {
      let clicks = 0;
      let delivered = 0;

      if (campaignsClick.clicked) clicks = 1;
      if (campaignsClick.delivered) delivered = 1;

      if (countryStatistics.length) {
        const isHasStatistic = countryStatistics.some(statistic =>
          statistic.ISO2 === campaignsClick.ISO2 ||
          statistic.country === campaignsClick.country);

        if (isHasStatistic) {
          countryStatistics.forEach(item => {
            if (item.ISO2 === campaignsClick.ISO2) {
              item.sent++;
              item.clicks += clicks;
              item.delivered += delivered;
            }
          })
        } else {

          const statistic = {
            ISO2: campaignsClick.ISO2,
            country: campaignsClick.country,
            clicks: clicks,
            delivered: delivered,
            sent: 1
          };
          countryStatistics.push(statistic);
        }
      } else {

        const statistic = {
          ISO2: campaignsClick.ISO2,
          country: campaignsClick.country,
          clicks: clicks,
          delivered: delivered,
          sent: 1
        };
        countryStatistics.push(statistic);
      }
    });
  }

  return countryStatistics;
}

async function getCommonStatistic(commonStatisticParams) {
  const {statistic, group, period, serviceID, userID} = commonStatisticParams;

  const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
  const stepDate = group === 'hour' ? moment.duration(1, 'hour') : moment.duration(1, 'day');
  const countStep = helpers.getCountStepsForAnalytics(period, group);

  const fromDate = period === 'day' ?
    moment().endOf('day').subtract(days, 'days') :
    moment().startOf('day').subtract(days, 'days');

  for (let i = 0, date = fromDate; i <= countStep; ++i) {
    let to = moment(date.format()).add(stepDate, group);
    statistic.graphStatistic.push({
      period: {
        from: date.toDate(),
        to: to.toDate(),
      },
      delivered: null,
      clicked: null,
    });
    date = to;
  }

  const paramsFind = {
    userID,
    clickCount: {
      $gte: 0
    },
  };

  if (serviceID !== 'r1fvb9ok2t-all-services') {
    paramsFind.serviceID = serviceID;
  }

  const campaigns = await Campaign.find(paramsFind, 'date deliveredCount clickCount sent').exec();

  campaigns.forEach((campaign) => {
    statistic.graphStatistic.forEach((item) => {
      if (campaign.date >= item.period.from && campaign.date <= item.period.to) {
        item.delivered += campaign.deliveredCount || 0;
        item.clicked += campaign.clickCount || 0;
      }
    });
    statistic.delivered += campaign.deliveredCount || 0;
    statistic.clicked += campaign.clickCount || 0;
    statistic.sent += campaign.sent || 0;
    statistic.notifications += 1;
  });

  return statistic;
}

async function getAnalyticsStatistic(req, res, next) {
  try {
    const [{category}, {_id: userID}] = [req.query, req.user];

    const objectError = {
      error: {
        id: 'unable-to-get-analytics-data',
        message: `We were unable to find analytics data`
      }
    };

    if (category === 'Common') {
      const {group, period, serviceID} = req.query;

      const statistic = {
        notifications: null,
        sent: null,
        delivered: null,
        clicked: null,
        graphStatistic: [],
      };

      const commonStatisticParams = {statistic, group, period, serviceID, userID};
      const commonStatistic = await getCommonStatistic(commonStatisticParams);

      sendJSONResponse(res, 200, commonStatistic);

    } else if (category === 'Countries') {
      const {serviceID, date} = req.query;
      const countriesStatisticParams = {userID, serviceID, date};
      const countriesStatistic = await getCountriesStatistic(countriesStatisticParams);

      sendJSONResponse(res, 200, countriesStatistic);

    } else {
      sendJSONResponse(res, 500, objectError);
    }
  } catch (error) {
    sendJSONResponse(res, 400, {error: {message: error.message}});
  }
}

module.exports = getAnalyticsStatistic;
