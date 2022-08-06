const asyncHandler = require('../middleware/async-handler');
const SignIn = require('../logic/auth/sign-in');
const SignUp = require('../logic/auth/sign-up');
const RefreshToken = require('../logic/auth/refresh-token');
const ConfirmAccount = require('../logic/auth/confirm-account');
const ResendVerificationCode = require('../logic/auth/resend-verification-code');
const SendVerificationCode = require('../logic/auth/send-verification-code');
const UpdatePassword = require('../logic/auth/update-password');

exports.signUp = asyncHandler(async (req, res) => {
  const { password, firstName, lastName, phone, specialization, placeOfWork, city } = req.body;

  const user = await SignUp.getUser(phone);

  await user
    .isExists()
    .setData({ phone, password, firstName, lastName, city })
    .isMaster(specialization, placeOfWork)
    .hashPassword()
    .generateVerificationCode()
    .save();

  if (process.env.NODE_ENV === 'not-working') {
    await user.sendVerificationCode();
  }

  return res.status(201).end();
});

exports.confirmAccount = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;

  const user = await ConfirmAccount.getUser(phone);

  await user.isExists().checkAttemptsCount().checkTime().checkVerificationCode(code);
  await user.confirmAccount();

  return res.sendToken(user);
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { phone, code, newPassword } = req.body;

  const user = await UpdatePassword.getUser(phone);

  await user.isExists().checkAttemptsCount().checkTime().checkVerificationCode(code);
  await user.hashNewPassword(newPassword).updatePassword();

  return res.end();
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

  if (process.env.NODE_ENV === 'not-working') {
    await user.sendVerificationCode();
  }

  return res.end();
});

exports.sendVerificationCode = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await SendVerificationCode.getUser(phone);
  const isUserExisted = user.isExisted();

  if (!isUserExisted) return res.end();

  await user.checkAttemptsCount().generateVerificationCode().updateResetPasswordField();

  if (process.env.NODE_ENV === 'not-working') {
    await user.sendVerificationCode();
  }

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

  await user.getData();

  return res.sendToken(user);
});
