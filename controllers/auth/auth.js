const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const sendEmail = require("../../utils/send-email");

const User = require("../../models/user/profile");
const HttpError = require("../../models/utils/http-error");

const asyncHandler = require("../../middleware/async-handler");

const generateResetToken = require("../../utils/generate-reset-token");
const { sendTokenResponse } = require("./utils");

exports.signUp = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  // See if user exists
  let user = await User.findOne({ email });

  if (user) {
    return next(new HttpError("User with that email has already existed.", 400));
  }

  user = new User(email, password, firstName, lastName);

  // Encrypt password
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);

  await user.save();

  return sendTokenResponse(user, res);
});

exports.signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // See if user exists
  const user = await User.findOne({ email }); // projection

  if (!user) return next(new HttpError("Invalid Email or Password.", 404));

  // Check Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new HttpError("Invalid Email or Password.", 404));

  return sendTokenResponse(user, res);
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return next(new HttpError("No refresh token", 404));

  let payload;
  // try {
  const {
    user: { id },
  } = jwt.verify(refreshToken, process.env.JWT_KEY_REFRESH);
  // } catch (err) {
  // return res.send({ ok: false, accessToken: "" });
  // }

  // token is valid and
  // we can send back an access token
  const user = await User.findOne({ _id: new ObjectId(id) });

  if (!user) return next(new HttpError("No user with this token", 404));

  return sendTokenResponse(user, res);
});

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return next(new HttpError("There is no user with that email", 404));

    const [resetToken, resetTokenData] = generateResetToken();

    await User.updateOne({ _id: user.id }, { resetTokenData });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password: \n\n ${resetUrl}`;
    const title = "Recover password";

    sendEmail(email, title, message);

    res.json("Email is sent");
  } catch (error) {
    console.log(error.message);
    await User.update({ _id: user.id }, { resetTokenData: { hashedResetToken: null, resetPasswordExpire: null } });
    return next(new HttpError());
  }
};

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resettoken } = req.params;

  const resetPasswordToken = crypto.createHash("sha256").update(resettoken).digest("hex");

  const resetTokenData = {
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  };

  const user = await User.findOne({ resetTokenData }, { _id: 1 });
  if (!user) return next(new HttpError("Invalid token", 400));

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  resetTokenData.hashedResetToken = null;
  resetTokenData.resetPasswordExpire = null;

  User.updateOne({ _id: user._id }, { password: hashedPassword, resetTokenData });
  res.json("Password is updated"); // send token?
});
