const Avatar = require('./avatar');
const User = require('../../models/user');
const HttpError = require('../../models/utils/http-error');
const { USERNAME_EXISTS } = require('../../config/errors/profile');

class Profile {
  static async updateProfile(profileId, fieldsForUpdate) {
    await User.updateOne({ _id: profileId }, { ...fieldsForUpdate });
  }

  static async updateUsername(profileId, username) {
    const isUsername = await User.findOne({ username: new RegExp(username, 'i') }, { _id: 1 });

    if (isUsername) throw new HttpError(USERNAME_EXISTS, 400);

    await User.updateOne({ _id: profileId }, { username });
  }

  static async updateAvatar(id, buffer) {
    const avatar = new Avatar({ id, buffer });

    await avatar.saveFS();

    await Avatar.deletePreviousFS(id);

    const { shortUrl } = await avatar.getShortUrl().updateUrlDB(id);

    return shortUrl;
  }
}

module.exports = Profile;
