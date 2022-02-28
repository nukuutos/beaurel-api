const dayjs = require('dayjs');
const { find } = require('./utils');

// mongodb      |   app
// sun    sat   |   sun    sat
//  1 --- 7     |    6 --- 5 / + 1
//                   7 --- 6 / % 7
//                   0 --- 6 / + 1
//                   1 --- 7

const createPipeline = (weekends, historyRecord) => [
  {
    $addFields: {
      dayOfWeek: { $dayOfWeek: '$date' },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $in: ['$dayOfWeek', weekends.map((weekday) => ((weekday + 1) % 7) + 1)] },
          then: 'unsuitable',
          else: '$status',
        },
      },
      history: {
        $cond: {
          if: { $in: ['$dayOfWeek', weekends.map((weekday) => ((weekday + 1) % 7) + 1)] },
          then: { $concatArrays: ['$history', [historyRecord]] },
          else: '$history',
        },
      },
    },
  },
  {
    $project: {
      dayOfWeek: 0,
    },
  },
];

module.exports = (defaultParams, weekends) => {
  const { bulkOp, masterId, date } = defaultParams;

  const historyDate = dayjs().utc().toDate();
  const historyRecord = { user: 'server', status: 'unsuitable', date: historyDate };

  const findQuery = find(masterId, date);

  const pipeline = createPipeline(weekends, historyRecord);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
