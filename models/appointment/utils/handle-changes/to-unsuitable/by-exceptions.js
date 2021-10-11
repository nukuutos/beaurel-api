// day of week !!!!
const { find } = require("./utils");

const createPipeline = (exceptions) => [
  {
    $addFields: {
      dayOfWeek: { $subtract: [{ $dayOfWeek: "$date" }, 1] },
      exceptions: { $objectToArray: exceptions },
    },
  },
  {
    $addFields: {
      day: { $arrayElemAt: ["$exceptions", "$dayOfWeek"] },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $in: ["$time.startAt", "$day.v"] },
          then: "unsuitable",
          else: "$status",
        },
      },
    },
  },
  {
    $project: {
      dayOfWeek: 0,
      exceptions: 0,
      day: 0,
    },
  },
];

// exceptions test it
module.exports = (defaultParams, exceptions) => {
  const { bulkOp, masterId, date } = defaultParams;

  const findQuery = find(masterId, date);
  const pipeline = createPipeline(exceptions);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
