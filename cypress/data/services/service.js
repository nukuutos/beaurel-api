const { ObjectId } = require('mongodb');
const master = require('../masters/master');

module.exports = (title) => ({
  _id: new ObjectId('6121fc9f8fce2120cc841b6c'),
  masterId: master._id,
  title,
  parameter: null,
  duration: 120,
  price: 324,
  order: 0,
  subOrder: null,
  update: null,
});
