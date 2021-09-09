const { saveImageFS } = require("../utils/image");
const { getCollection } = require("../utils/database");
const Collection = require("./utils/collection/collection");
const { WORK } = require("../config/collection-names");
const getRootDir = require("../utils/get-root-dir");
const path = require("path");

const getPath = (id, subFolder) => {
  const filename = id + ".png";
  const rootDir = getRootDir();
  const pathToFile = path.join(rootDir, "images", subFolder, filename);
  return pathToFile;
};

class Work extends Collection {
  static name = WORK;

  constructor(masterId, title) {
    super();

    this.masterId = masterId;
    this.title = title;
  }

  async save(buffer) {
    const collection = getCollection("works");

    const { insertedId } = await collection.insertOne(this);
    const imageUrl = "images/" + "works/" + insertedId + ".png";

    getPath("works");

    // can i refactor this?
    try {
      // save in fs image
      await saveImageFS(buffer, imageUrl);
    } catch (error) {
      // if error, delete in db without await
      Work.deleteOne({ _id: insertedId });
      throw new Error(error.message);
    }

    return insertedId;
  }
}

module.exports = Work;
