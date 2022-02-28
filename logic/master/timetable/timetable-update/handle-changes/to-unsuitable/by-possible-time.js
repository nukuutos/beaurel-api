// day of week !!!!

const dayjs = require('dayjs');
const { find: defaultFind } = require('./utils');

const createFindQuery = (defaultParams, possibleTimes, sessionTime) => {
  const { masterId, date } = defaultParams;

  const defaultQuery = defaultFind(masterId, date);

  possibleTimes = [...possibleTimes, possibleTimes[possibleTimes.length - 1] + sessionTime];

  return {
    ...defaultQuery,
    $or: [{ 'time.startAt': { $nin: possibleTimes } }, { 'time.endAt': { $nin: possibleTimes } }],
  };
};

module.exports = (defaultParams, possibleTimes, sessionTime) => {
  const { bulkOp } = defaultParams;

  const findQuery = createFindQuery(defaultParams, possibleTimes, sessionTime);

  const historyDate = dayjs().utc().toDate();
  const historyRecord = { user: 'server', status: 'unsuitable', date: historyDate };

  const updateQuery = {
    $set: { status: 'unsuitable' },
    $push: { history: historyRecord },
  };

  bulkOp.aggregationUpdate(findQuery, updateQuery);
};
