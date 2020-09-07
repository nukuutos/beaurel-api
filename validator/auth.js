const { check } = require('express-validator');

const email = check('email') // +-//
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please enter a valid email')
  .normalizeEmail();

const passwordSignUp = check('password')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Password is required')
  .isLength({ min: 6 })
  .withMessage('Password min legnth is 6 characters long')
  .custom((password, { req }) => {
    const { confPassword } = req.body;
    if (password !== confPassword) {
      throw new Error('Passwords are dismatched');
    }
    return true;
  });

const passwordSignIn = check('password')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Password is required');

const firstName = check('firstName')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('First Name is required')
  .isAlpha()
  .withMessage('First Name must contain only letters');

const lastName = check('lastName')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Last Name is required')
  .isAlpha()
  .withMessage('Last Name must contain only letters');

exports.signUp = [email, passwordSignUp, firstName, lastName];
exports.signIn = [email, passwordSignIn];
exports.forgotPassword = [email];
