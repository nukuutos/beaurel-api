const { INVALID_IDENTIFICATOR_OR_PASSWORD } = require('../../../../config/errors/auth');

const identificator = {
  name: 'identificator',
  tests: [
    {
      message: 'should fail, invalid identificator',
      data: { identificator: 'русское' },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, invalid identificator',
      data: { identificator: '___' },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, invalid identificator',
      data: { identificator: '' },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, invalid identificator',
      data: { identificator: null },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, invalid identificator',
      data: { identificator: ' ' },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, invalid identificator',
      data: { identificator: '...' },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, invalid identificator',
      data: { identificator: 'ab2 c3' },
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
    {
      message: 'should fail, no field',
      data: {},
      error: INVALID_IDENTIFICATOR_OR_PASSWORD,
    },
  ],
};

module.exports = identificator;
