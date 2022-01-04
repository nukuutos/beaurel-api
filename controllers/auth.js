const asyncHandler = require('../middleware/async-handler');
const SignIn = require('../logic/auth/sign-in');
const SignUp = require('../logic/auth/sign-up');
const RefreshToken = require('../logic/auth/refresh-token');
const ConfirmAccount = require('../logic/auth/confirm-account');
const ResendVerificationCode = require('../logic/auth/resend-verification-code');

exports.signUp = asyncHandler(async (req, res) => {
  const { password, firstName, lastName, phone, specialization } = req.body;

  const user = await SignUp.getUser(phone);

  await user
    .isExists()
    .setData({ phone, password, firstName, lastName })
    .isMaster(specialization)
    .hashPassword()
    .generateVerificationCode()
    .save();

  // send confirmation code

  return res.status(201).end();
});

exports.confirmAccount = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;

  const user = await ConfirmAccount.getUser(phone);

  await user.isExists().checkAttemptsCount().checkTime().checkVerificationCode(code);
  await user.confirmAccount();

  return res.sendToken(user);
});

exports.resendVerificationCode = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await ResendVerificationCode.getUser(phone);

  await user
    .isExists()
    .isConfirmed()
    .checkAttemptsCount()
    .generateVerificationCode()
    .updateConfirmationField();

  // send code

  return res.end();
});

exports.signIn = asyncHandler(async (req, res) => {
  const { identificator, password: enteredPassword } = req.body;

  const user = await SignIn.getUser(identificator);

  user.isExists().checkPassword(enteredPassword);

  return res.sendToken(user);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = RefreshToken.verifyToken(refreshToken);

  await user.isExists();

  return res.sendToken(user);
});
