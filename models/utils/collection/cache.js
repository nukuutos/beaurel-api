const { AbstractCursor } = require("mongodb/lib/cursor/abstract_cursor");
const { Collection } = require("mongodb/lib/collection");
const client = require("../../../utils/redis");

const next = AbstractCursor.prototype.next;
const toArray = AbstractCursor.prototype.toArray;
const find = Collection.prototype.find;

const handleCache = (fn) => {
  return async function () {
    const { cacheKeys } = this;

    if (!cacheKeys) return await fn.apply(this, arguments);

    const cachedData = await client.hget(cacheKeys[0], cacheKeys[1]);

    if (cachedData) return JSON.parse(cachedData);

    const data = await fn.apply(this, arguments);

    client.hset(cacheKeys[0], cacheKeys[1], JSON.stringify(data));

    const expirationTime = cacheKeys[2];

    if (expirationTime) client.expire(cacheKeys[0], expirationTime);

    return data;
  };
};

function cache(...args) {
  if (args.includes(null)) return this;

  const cacheKeys = args.map((key) => {
    const isMongoId = typeof key === "object";
    return isMongoId ? "id-" + key.toString() : key;
  });

  const cursor = Object.assign(this, { cacheKeys });

  return cursor;
}

function patchedFind() {
  const findResult = find.apply(this, arguments);

  // add cacheKeys
  const result = Object.assign(findResult, { cacheKeys: this.cacheKeys || null });

  return result;
}

AbstractCursor.prototype.next = handleCache(next);
AbstractCursor.prototype.toArray = handleCache(toArray);
AbstractCursor.prototype.cache = cache;
Collection.prototype.cache = cache;
// for findOne cache
Collection.prototype.find = patchedFind;
