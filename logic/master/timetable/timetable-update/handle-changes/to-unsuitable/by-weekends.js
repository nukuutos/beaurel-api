const { find } = require('./utils');

// mongodb      |   app
// sun    sat   |   sun    sat
//  1 --- 7     |    6 --- 5 / + 1
//                   7 --- 6 / % 7
//                   0 --- 6 / + 1
//                   1 --- 7

const createPipeline = (weekends) => [
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

  const findQuery = find(masterId, date);

  const pipeline = createPipeline(weekends);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
