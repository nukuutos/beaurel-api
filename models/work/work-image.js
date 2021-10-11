const { ObjectId } = require("mongodb");
const Image = require("../utils/image");

class WorkImage extends Image {
  constructor(id, buffer) {
    super(buffer);
    this.name = WorkImage.createName(id);
    this.url = Image.createUrl(this.name, "works");
  }

  static createName(id) {
    const isObjectId = ObjectId.isValid(id);
    if (isObjectId) id = id.toString();
    return id + ".png";
  }
}

module.exports = WorkImage;
