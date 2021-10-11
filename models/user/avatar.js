const path = require("path");
const { NO_IMAGE_URL } = require("../../config/errors/image");
const HttpError = require("../utils/http-error");
const Image = require("../utils/image");
const User = require("./user");

class Avatar extends Image {
  constructor({ buffer, id, shortUrl = null }) {
    super(buffer);

    this.name = Avatar.createName(id);
    this.url = Image.createUrl(this.name, "avatars");
    this.shortUrl = shortUrl;
  }

  static createName(id) {
    const date = new Date().toISOString().replace(/:/g, "-");
    const imageName = date + "-" + id + ".png";
    return imageName;
  }

  static async deletePreviousFS(id) {
    const { avatar: shortUrl } = await User.findOne({ _id: id }, { _id: 0, avatar: 1 });

    if (shortUrl) {
      const avatar = new Avatar({ shortUrl });
      avatar.getFullUrl().deleteFS();
    }
  }

  async updateDB(id) {
    const { shortUrl } = this;
    await User.updateOne({ _id: id }, { avatar: shortUrl });
    return this;
  }

  getShortUrl() {
    const { url } = this;

    if (!url) throw new HttpError(NO_IMAGE_URL, 400);

    const splittedUrl = url.split("\\");
    const startIndex = splittedUrl.indexOf("images");
    const shortUrl = splittedUrl.slice(startIndex).join("/");

    this.shortUrl = shortUrl;

    return this;
  }

  getFullUrl() {
    const { shortUrl } = this;

    const url = path.rootJoin(shortUrl);

    this.url = url;

    return this;
  }
}

module.exports = Avatar;
