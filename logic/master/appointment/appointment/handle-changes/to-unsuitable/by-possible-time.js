// day of week !!!!

const { find: defaultFind } = require("./utils");

const createFindQuery = (defaultParams, possibleTimes, sessionTime) => {
  const { masterId, date } = defaultParams;

  const defaultQuery = defaultFind(masterId, date);

  possibleTimes = [...possibleTimes, possibleTimes[possibleTimes.length - 1] + sessionTime];

  return {
    ...defaultQuery,
    $or: [{ "time.startAt": { $nin: possibleTimes } }, { "time.endAt": { $nin: possibleTimes } }],
  };
};

module.exports = (defaultParams, possibleTimes, sessionTime) => {
  const { bulkOp } = defaultParams;

  const findQuery = createFindQuery(defaultParams, possibleTimes, sessionTime);
  const updateQuery = { status: "unsuitable" };

  bulkOp.update(findQuery, updateQuery);
};
