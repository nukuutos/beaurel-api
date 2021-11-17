const Avatar = require('./avatar');
const User = require('../../models/user');

class Profile {
  static async udpateProfile(profileId, fieldsForUpdate) {
    await User.updateOne({ _id: profileId }, { ...fieldsForUpdate });
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
