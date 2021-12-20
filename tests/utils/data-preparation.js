const addDataToTest = (field, correctData) => {
  const { tests, name } = field;

  const testsWithData = tests.map((test) => {
    const fieldValue = test.data[name];

    const newData = { ...correctData };

    const isUndefined = typeof fieldValue === 'undefined';

    if (isUndefined) {
      delete newData[name];
      return { ...test, data: newData };
    }

    newData[name] = fieldValue;

    return { ...test, data: newData };
  });

  return { ...field, tests: testsWithData };
};

const dataPreparation = (fields, data) => fields.map((field) => addDataToTest(field, data));

module.exports = dataPreparation;
