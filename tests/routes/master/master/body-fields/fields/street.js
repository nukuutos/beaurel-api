const { NO_STREET, INVALID_STREET_LENGTH } = require('../../../../../../config/errors/auth');

const streetLengthMoreThan148 =
  'оаыдвоадыводывдовыадаывадвоылавыолдаыволдавыолдаыводлаыволдаыводлываолдыавдлоываолдыаводлаыводлыаводлаыводлаыводлаыводлываодлаыводлыываолдодлдолывавв';

const street = {
  name: 'street',
  tests: [
    {
      message: 'should fail, no param',
      data: { street: '' },
      error: NO_STREET,
    },
    {
      message: 'should fail, no param',
      data: { street: null },
      error: NO_STREET,
    },
    {
      message: 'should fail, no param',
      data: { street: ' ' },
      error: NO_STREET,
    },
    {
      message: 'should fail, invalid param',
      data: { street: 'В' },
      error: INVALID_STREET_LENGTH,
    },
    {
      message: 'should fail, invalid param',
      data: { street: streetLengthMoreThan148 },
      error: INVALID_STREET_LENGTH,
    },
  ],
};

module.exports = street;
