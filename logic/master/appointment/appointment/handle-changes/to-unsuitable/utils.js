const unnecessaryStatuses = ['unsuitable', 'rejected', 'history', 'cancelled'];

const find = (masterId, date) => ({
  masterId,
  date: { $gte: date },
  status: { $nin: unnecessaryStatuses },
});

module.exports = { find, unnecessaryStatuses };
