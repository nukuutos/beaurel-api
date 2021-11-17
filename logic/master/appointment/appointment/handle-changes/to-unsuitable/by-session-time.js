// day of week !!!!

const { find: defaultFind } = require('./utils');

const createFindQuery = (defaultParams, sessionTime) => {
  const { masterId, date } = defaultParams;
  const defaultQuery = defaultFind(masterId, date);
  return { ...defaultQuery, 'service.duration': { $not: { $mod: [sessionTime, 0] } } };
};

module.exports = (defaultParams, sessionTime) => {
  const { bulkOp } = defaultParams;
  const findQuery = createFindQuery(defaultParams, sessionTime);

  const updateQuery = { status: 'unsuitable' };

  bulkOp.update(findQuery, updateQuery);
};
