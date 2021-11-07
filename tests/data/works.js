const { ObjectId } = require('mongodb');

const master = require('./masters/master');

module.exports = [
  {
    _id: new ObjectId('613f4bed08e9f626d4080777'),
    masterId: master._id,
    title: 'название уже существует',
  },
  {
    _id: new ObjectId('613f4c043fbf4f274000dabd'),
    masterId: master._id,
    title: 'кул е',
  },
  {
    _id: new ObjectId('613f4c629c306e265cd08ba7'),
    masterId: master._id,
    title: 'супер нупуер',
  },
];
