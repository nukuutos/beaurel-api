const dayjs = require('dayjs');
const sharp = require('sharp');
const Avatar = require('./avatar');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');
const { USERNAME_EXISTS } = require('../../config/errors/profile');
const customerProfile = require('../../pipelines/user/customer-profile');
const { getIO } = require('../../utils/socket');
const { SET_ONLINE_STATUS } = require('../../config/socket-io/types');
const s3 = require('../../utils/s3');
const { ERROR_ON_SAVE } = require('../../config/errors/image');

const { IS_SOCKET_IO } = process.env;

class Profile {
  static async updateProfile(profileId, fieldsForUpdate) {
    await User.updateOne({ _id: profileId }, { ...fieldsForUpdate });
  }

  static async getCustomerProfile(profileId) {
    const pipeline = customerProfile(profileId);
    const data = await User.aggregate(pipeline).next();
    return data;
  }

  static async getOnlineStatus(profileId) {
    const data = await User.findOne({ _id: profileId }, { _id: 0, wasOnline: 1 });
    return data;
  }

  static async updateUsername(profileId, username) {
    const isUsername = await User.findOne({ username: new RegExp(username, 'i') }, { _id: 1 });

    if (isUsername) throw new HttpError(USERNAME_EXISTS, 400);

    await User.updateOne({ _id: profileId }, { username });
  }

  static async updateAvatar(id, buffer) {
    buffer = await sharp.decreaseSize(buffer);

    const filename = `avatar.webp`;
    const folder = `${id}`;

    const isUploaded = await s3.Upload(
      {
        buffer,
        name: filename,
      },
      folder
    );

    if (!isUploaded) throw new HttpError(ERROR_ON_SAVE, 500);

    await User.updateOne({ _id: id }, { isAvatar: true });
  }

  static updateOnlineStatus(profileId) {
    const wasOnline = new Date();

    User.updateOne({ _id: profileId }, { wasOnline });

    if (!IS_SOCKET_IO) return this;

    const io = getIO();

    const event = `${profileId}-online`;

    io.emit(event, {
      type: SET_ONLINE_STATUS,
      payload: { interlocutorId: profileId, wasOnline },
    });

    return this;
  }

  static async deleteUnconfirmedAccounts() {
    const date = dayjs().subtract(7, 'day').toDate();

    await User.deleteMany({
      'confirmation.isConfirmed': false,
      createdAt: { $lte: date },
    });
  }

  static async restoreAttempts() {
    const date = dayjs().subtract(2, 'h').toDate();

    await User.updateMany(
      {
        'confirmation.lastSendAt': { $lte: date },
        'confirmation.attemptsCountLeft': { $lt: 5 },
        'confirmation.resendCountLeft': { $lt: 5 },
      },
      { 'confirmation.attemptsCountLeft': 5, 'confirmation.resendCountLeft': 5 }
    );
  }

  static async restoreResetPasswordAttempts() {
    const date = dayjs().subtract(2, 'h').toDate();

    await User.updateMany(
      {
        'resetPassword.lastSendAt': { $lte: date },
        'resetPassword.attemptsCountLeft': { $lt: 5 },
      },
      { 'resetPassword.attemptsCountLeft': 5 }
    );
  }
}

module.exports = Profile;
