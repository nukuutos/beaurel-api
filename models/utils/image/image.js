const sharp = require("sharp");
const fs = require("fs");
const HttpError = require("../http-error");
const { createName, createUrl } = require("./utils");

class Image {
  constructor({ buffer, id, subfolder }, { withDate } = {}) {
    this.buffer = buffer;
    this.name = createName(id, withDate);
    this.url = createUrl(this.name, subfolder);
  }

  static delete(id, subfolder) {
    const name = createName(id);
    const url = createUrl(name, subfolder);

    Image.deleteByUrl(url);
  }

  static deleteByUrl(url) {
    fs.unlinkSync(url, (error) => {
      if (error) throw new HttpErorr("Error on delete image", 500);
    });
  }

  async save(onError = null) {
    try {
      this.formatBuffer();
      await this.saveFS();
    } catch (error) {
      if (onError) onError(error);
      throw new HttpError("Error on save image", 500);
    }
  }

  async formatBuffer() {
    const { buffer } = this;

    // promisify ?
    this.buffer = await sharp(buffer)
      .metadata()
      .then(({ width, height }) => {
        const maxSize = 600;

        if (width > maxSize && width >= height) {
          return sharp(buffer).resize(maxSize).toBuffer();
        }

        if (height > maxSize && height >= width) {
          return sharp(buffer).resize(null, maxSize).toBuffer();
        }

        return buffer;
      });
  }

  async saveFS() {
    const { buffer, url } = this;
    await sharp(buffer).png({ quality: 86 }).toFile(url);
  }
}

module.exports = Image;
