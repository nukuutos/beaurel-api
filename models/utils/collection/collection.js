const { getCollection } = require("../../../utils/database");
const { checkClass, getCollectionName } = require("./utils");

class Collection {
  static name = null;

  static collection() {
    const isClass = checkClass(this);
    const collectionName = getCollectionName(this, isClass);
    return getCollection(collectionName);
  }

  async save() {
    const collection = Collection.collection.call(this);
    await collection.insertOne(this);
  }

  static async insertMany(data) {
    return await this.collection().insertMany(data);
  }

  static async find(query, projection = null, { page = 0, limit = 0 }) {
    return await this.collection()
      .find(query, { projection: projection })
      .skip(page * limit)
      .limit(limit)
      .toArray();
  }

  static async findOne(query, projection = null) {
    return await this.collection().findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    await this.collection().updateOne(query, { $set: update });
  }

  static async updateMany(query, update) {
    await this.collection().updateMany(query, { $set: update });
  }

  static async deleteOne(query) {
    await this.collection().deleteOne(query);
  }

  static async deleteMany(query) {
    await this.collection().deleteMany(query);
  }

  static aggregate(pipeline) {
    return this.collection().aggregate(pipeline);
  }

  static async orderedBulkOp() {
    return this.collection().initializeOrderedBulkOp();
  }

  static async unorderedBulkOp() {
    return this.collection().initializeUnorderedBulkOp();
  }
}

module.exports = Collection;
