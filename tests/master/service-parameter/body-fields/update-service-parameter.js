const dataPreparation = require('../../../utils/data-preparation');
const title = require('./fields/title');

const data = { title: 'супер услуга с параметрами' };

const fields = [title];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
