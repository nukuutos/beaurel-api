const dayjs = require('dayjs');
const master = require('../masters/master');

module.exports = {
  masterId: master._id,
  title: 'Ываы',
  duration: 120,
  price: 23423,
  order: 0,
  subOrder: null,
  parameter: null,
  update: { date: dayjs().add(3, 'day').startOf('day').utc().toDate(), status: 'unsuitable' },
};
