const checkIsCache = async (getCache) => {
  const cacheData = await getCache();
  expect(cacheData).not.toBeNull();
};

const checkIsCacheDeleted = async (getCache) => {
  const cacheData = await getCache();
  expect(cacheData).toBeNull();
};

const checkCache = (getCache) => [
  () => checkIsCache(getCache),
  () => checkIsCacheDeleted(getCache),
];

module.exports = checkCache;
