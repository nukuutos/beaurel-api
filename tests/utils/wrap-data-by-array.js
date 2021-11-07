const wrapDataByArray = (fieldsData, arrayName, rootData = {}) => {
  const wrappedData = fieldsData.map((testData) => {
    const { tests } = testData;

    const testsWithWrapper = tests.map((test) => {
      const { data } = test;

      const newData = {};
      newData[arrayName] = [data];

      return { ...test, data: { ...rootData, ...newData } };
    });

    return { ...testData, tests: testsWithWrapper };
  });

  return wrappedData;
};

module.exports = wrapDataByArray;
