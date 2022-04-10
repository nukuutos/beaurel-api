const { confirmedMaster } = require('./data-to-db');

const validData = {
  phone: confirmedMaster.phone,
};

const invalidData = {
  phone: '+79999999989',
};

module.exports = { validData, invalidData };
