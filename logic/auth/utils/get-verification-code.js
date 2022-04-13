const crypto = require('crypto');

const symbols = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const getVerificationCode = () => {
  let code = '';

  for (let i = 0; i < 4; i++) {
    const index = crypto.randomInt(symbols.length);
    code += symbols[index];
  }

  return code;
};

module.exports = getVerificationCode;
