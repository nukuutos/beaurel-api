const dataPreparation = require('../../../../utils/data-preparation');
const comment = require('./fields/comment');
const value = require('./fields/value');

const data = {
  value: '4',
  comment: 'красота значит, автор жжёт!',
};

const fields = [value, comment];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
