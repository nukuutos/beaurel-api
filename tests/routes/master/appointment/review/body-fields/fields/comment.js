const {
  COMMENT_REQUIRED,
  COMMENT_LENGTH,
  INVALID_COMMENT,
} = require('../../../../../../../config/errors/review');

const commentMoreMaxLength =
  'сукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлооыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлосукиываодылв оадывоадлоывалдо оыарвлралыврадоывдлооыарвлралыврадоывдлоалыврадоывд';

const comment = {
  name: 'comment',
  tests: [
    {
      message: 'should fail, field required',
      data: { comment: '' },
      error: COMMENT_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { comment: null },
      error: COMMENT_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: COMMENT_REQUIRED,
    },
    {
      message: 'should fail, invalid length',
      data: { comment: 'аг' },
      error: COMMENT_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { comment: commentMoreMaxLength },
      error: COMMENT_LENGTH,
    },
  ],
};

module.exports = comment;
