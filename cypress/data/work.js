const { ObjectId } = require('mongodb');

const master = require('./masters/master');

module.exports = {
  _id: new ObjectId('613f4bed08e9f626d4080777'),
  masterId: master._id,
  title: 'название уже существует',
};
