// appointments test it
// day of week !!!!
const { find } = require("./utils");

const createPipeline = (appointments) => [
  {
    $addFields: {
      dayOfWeek: { $dayOfWeek: "$date" },
      appointments: { $objectToArray: appointments },
    },
  },
  {
    $addFields: {
      day: { $arrayElemAt: ["$appointments", "$dayOfWeek"] },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $not: { $in: ["$time.startAt", "$day.v"] } },
          then: "unsuitable",
          else: "$status",
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

module.exports = (defaultParams, appointments) => {
  const { bulkOp, masterId, date } = defaultParams;

  const findQuery = find(masterId, date);
  const pipeline = createPipeline(appointments);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
