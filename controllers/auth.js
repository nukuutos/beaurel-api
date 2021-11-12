const asyncHandler = require('../middleware/async-handler');
const SignIn = require('../logic/auth/sign-in');
const SignUp = require('../logic/auth/sign-up');
const RefereshToken = require('../logic/auth/refresh-token');

exports.signUp = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const user = await SignUp.getUser(email);

  await user.isExists().setData({ email, password, firstName, lastName }).hashPassword().save();

  return res.status(201).sendToken(user.data);
});

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password: enteredPassword } = req.body;

  const user = await SignIn.getUser(email);

  user.isExists().checkPassword(enteredPassword);

  return res.sendToken(user.data);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = RefereshToken.verifyToken(refreshToken);

  await user.isExists();

  return res.sendToken(user.data);
});
