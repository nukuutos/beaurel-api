const User = require("../models/user/user");
const HttpError = require("../models/utils/http-error");

const asyncHandler = require("../middleware/async-handler");
const AuthUser = require("../models/user/auth-user");
const {
  USER_EXISTS,
  INVALID_EMAIL_OR_PASSWORD,
  NO_REFRESH_TOKEN,
} = require("../config/errors/auth");

exports.signUp = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  let user = await User.findOne({ email });

  if (user) throw new HttpError(USER_EXISTS, 400);

  user = new User({ email, password, firstName, lastName });

  await user.hashPassword().save();

  return res.status(201).sendToken(user);
});

exports.signIn = asyncHandler(async (req, res) => {
  const { email, password: enteredPassword } = req.body;

  const userData = await User.findOne({ email }, { email: 1, password: 1, role: 1 });

  if (!userData) throw new HttpError(INVALID_EMAIL_OR_PASSWORD, 404);

  const user = new AuthUser({ ...userData });

  user.checkPassword(enteredPassword);

  return res.sendToken(user);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const _id = User.verifyToken(refreshToken);
  const user = await User.findOne({ _id }, { role: 1 });

  if (!user) throw new HttpError(INVALID_TOKEN, 400);

  return res.sendToken(user);
});
