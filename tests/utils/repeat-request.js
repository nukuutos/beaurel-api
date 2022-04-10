const repeatRequest = async (request, times) => {
  const promises = [];
  for (let i = 0; i < times; i++) {
    const promise = request();
    promises.push(promise);
  }
  await Promise.all(promises);
};

module.exports = repeatRequest;
