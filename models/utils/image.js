const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const HttpError = require("./http-error");
const { ERROR_ON_SAVE } = require("../../config/errors/image");

class Image {
  constructor(buffer) {
    this.buffer = buffer;
  }

  static createUrl(name, subfolder) {
    const url = path.rootJoin("images", subfolder, name);
    return url;
  }

  async saveFS(onError = null) {
    try {
      await this.formatBuffer();
      await this.save();
    } catch (error) {
      console.log(error, error.message);
      if (onError) onError(error);
      throw new HttpError(ERROR_ON_SAVE, 500);
    }
  }

  async save() {
    const { buffer, url } = this;
    await sharp(buffer).png({ quality: 86 }).toFile(url);
  }

  async formatBuffer() {
    const { buffer } = this;

    this.buffer = await sharp.decreaseSize(buffer);

    return this;
  }

  deleteFS() {
    const { url } = this;
    fs.unlinkSync(url);
  }

  static deleteFS(url) {
    fs.unlinkSync(url);
  }
}

module.exports = Image;
