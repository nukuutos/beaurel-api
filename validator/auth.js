const { body, cookie } = require("express-validator");

const {
  NO_REFRESH_TOKEN,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  PASSWORD_REQUIRED,
  MIN_PASSWORD_LENGTH,
  PASSWORDS_DISMATCHED,
  ALPHABATIC_FIRST_NAME,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  ALPHABATIC_LAST_NAME,
  MIN_LAST_NAME_LENGTH,
  MIN_FIRST_NAME_LENGTH,
} = require("../config/errors/auth");

const email = body("email")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(EMAIL_REQUIRED)
  .isEmail()
  .withMessage(INVALID_EMAIL)
  .normalizeEmail();

const passwordSignUp = body("password")
  .exists({ checkFalsy: true })
  .withMessage(PASSWORD_REQUIRED)
  .isLength({ min: 6 })
  .withMessage(MIN_PASSWORD_LENGTH)
  .custom((password, { req }) => {
    const { confPassword } = req.body;
    return password === confPassword;
  })
  .withMessage(PASSWORDS_DISMATCHED);

const passwordSignIn = body("password").exists({ checkFalsy: true }).withMessage(PASSWORD_REQUIRED);

const firstName = body("firstName")
  .exists({ checkFalsy: true })
  .withMessage(FIRST_NAME_REQUIRED)
  .trim()
  .isLength({ min: 2 })
  .withMessage(MIN_FIRST_NAME_LENGTH)
  .isAlpha("ru-RU")
  .withMessage(ALPHABATIC_FIRST_NAME);

const lastName = body("lastName")
  .exists({ checkFalsy: true })
  .withMessage(LAST_NAME_REQUIRED)
  .trim()
  .isLength({ min: 2 })
  .withMessage(MIN_LAST_NAME_LENGTH)
  .isAlpha("ru-RU")
  .withMessage(ALPHABATIC_LAST_NAME);

const refreshToken = cookie("refreshToken")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_REFRESH_TOKEN);

exports.signUp = [email, passwordSignUp, firstName, lastName];
exports.signIn = [email, passwordSignIn];
exports.refreshToken = [refreshToken];
