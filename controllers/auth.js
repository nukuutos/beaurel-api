const asyncHandler = require('../middleware/async-handler');
const SignIn = require('../logic/auth/sign-in');
const SignUp = require('../logic/auth/sign-up');
const RefreshToken = require('../logic/auth/refresh-token');

exports.signUp = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const user = await SignUp.getUser(email);

  await user.isExists().setData({ email, password, firstName, lastName }).hashPassword().save();

  return res.status(201).sendToken(user);
});

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password: enteredPassword } = req.body;

  const user = await SignIn.getUser(email);

  user.isExists().checkPassword(enteredPassword);

  return res.sendToken(user);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = RefreshToken.verifyToken(refreshToken);

  await user.isExists();

  return res.sendToken(user);
});
