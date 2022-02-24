const { getCollection } = require('../../../utils/database');
const { checkClass, getCollectionName } = require('./utils');

require('./bulk');
require('./cache');

class Collection {
  static name = null;

  static collection() {
    const isClass = checkClass(this);
    const collectionName = getCollectionName(this, isClass);
    return getCollection(collectionName);
  }

  async save() {
    const collection = Collection.collection.call(this);
    return await collection.insertOne(this);
  }

  static async save(object) {
    return await this.collection().insertOne(object);
  }

  static async insertMany(data) {
    return await this.collection().insertMany(data);
  }

  static async find(query, projection = null, { page = 0, limit = 0, sort = null } = {}) {
    const findObject = this.collection()
      .find(query, { projection })
      .sort(sort)
      .skip(page * limit)
      .limit(limit);

    const result = Object.assign(findObject, this);

    delete this.cacheKeys;

    return await result.toArray();
  }

  static async findOne(query, projection = null) {
    const collection = this.collection();
    const result = Object.assign(collection, this);

    delete this.cacheKeys;

    return await result.findOne(query, { projection });
  }

  static async updateOne(query, update, options) {
    const stringUpdate = JSON.stringify(update);
    const isQuerySign = stringUpdate.includes('$');

    update = isQuerySign ? update : { $set: update };

    return await this.collection().updateOne(query, update, options);
  }

  static async updateMany(query, update) {
    const isAggregation = Array.isArray(update);

    if (isAggregation) {
      return await this.collection().updateMany(query, update);
    }

    const stringUpdate = JSON.stringify(update);
    const isQuerySign = stringUpdate.includes('$');
    update = isQuerySign ? update : { $set: update };
    return await this.collection().updateMany(query, update);
  }

  static async deleteOne(query) {
    return await this.collection().deleteOne(query);
  }

  static async deleteMany(query) {
    return await this.collection().deleteMany(query);
  }

  static aggregate(pipeline) {
    const aggregateObject = this.collection().aggregate(pipeline);
    const result = Object.assign(aggregateObject, this);

    delete this.cacheKeys;

    return result;
  }

  static cache(...cacheKeys) {
    const collection = this.collection().cache(...cacheKeys);
    // eslint-disable-next-line prefer-object-spread
    const result = Object.assign(this, { cacheKeys: collection.cacheKeys });

    return result;
  }

  static orderedBulkOp() {
    return this.collection().initializeOrderedBulkOp();
  }

  static unorderedBulkOp() {
    return this.collection().initializeUnorderedBulkOp();
  }
}

module.exports = Collection;
