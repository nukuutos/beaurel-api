// day of week !!!!
const { find } = require("./utils");

const createPipeline = (weekends) => [
  {
    $addFields: {
      dayOfWeek: { $dayOfWeek: "$date" },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $in: ["$dayOfWeek", weekends.map((day) => day + 1)] }, // "+ 1" are u sure?
          then: "unsuitable",
          else: "$status",
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

  bulkOp.updateAggregation(findQuery, pipeline);
};
