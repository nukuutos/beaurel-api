const unnecessaryStatuses = ['unsuitable', 'rejected', 'history', 'cancelled', 'unanswered'];

const find = (masterId, date) => ({
  masterId,
  date: { $gte: date },
  status: { $nin: unnecessaryStatuses },
});

module.exports = { find, unnecessaryStatuses };
