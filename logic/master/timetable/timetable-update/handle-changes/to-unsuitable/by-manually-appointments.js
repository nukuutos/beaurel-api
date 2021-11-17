const { find } = require('./utils');

const createPipeline = (appointments) => [
  {
    $addFields: {
      dayOfWeek: { $subtract: [{ $dayOfWeek: '$date' }, 1] }, // to indexes
      appointments: { $objectToArray: appointments },
    },
  },
  {
    $addFields: {
      day: { $arrayElemAt: ['$appointments', '$dayOfWeek'] },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $not: { $in: ['$time.startAt', '$day.v'] } },
          then: 'unsuitable',
          else: '$status',
        },
      },
    },
  },
  {
    $project: {
      dayOfWeek: 0,
      appointments: 0,
      day: 0,
    },
  },
];

// change exception keys for date format in mongodb
const formatWeekObjectForMongodb = (object) => {
  const weekdays = Object.keys(object);
  const values = Object.values(object);

  const formatedWeekdays = weekdays.map((weekday) => ((Number(weekday) + 1) % 7) + 1);

  const result = {};

  for (let i = 0; i < 7; i++) {
    const key = formatedWeekdays[i];
    const value = values[i];

    result[key] = value;
  }

  return result;
};

module.exports = (defaultParams, appointments) => {
  const { bulkOp, masterId, date } = defaultParams;

  const findQuery = find(masterId, date);

  const formatedAppointments = formatWeekObjectForMongodb(appointments);

  const pipeline = createPipeline(formatedAppointments);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
