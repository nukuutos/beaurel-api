// day of week !!!!

const dayjs = require('dayjs');
const { find: defaultFind } = require('./utils');

const createFindQuery = (defaultParams, sessionTime) => {
  const { masterId, date } = defaultParams;
  const defaultQuery = defaultFind(masterId, date);
  return { ...defaultQuery, 'service.duration': { $not: { $mod: [sessionTime, 0] } } };
};

module.exports = (defaultParams, sessionTime) => {
  const { bulkOp } = defaultParams;
  const findQuery = createFindQuery(defaultParams, sessionTime);

  const historyDate = dayjs().utc().toDate();
  const historyRecord = { user: 'server', status: 'unsuitable', date: historyDate };

  const updateQuery = {
    $set: { status: 'unsuitable' },
    $push: { history: historyRecord },
  };

  bulkOp.aggregationUpdate(findQuery, updateQuery);
};
