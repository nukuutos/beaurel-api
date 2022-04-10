const cloneDeep = require('lodash.clonedeep');

// handle nested objects{}
// e.g. { field: { nestedField: { superNestedField: 1 } } }

// handle array[] with objects only with one level of nesting
// e.g. { field: { nestedField: { arrayField: [ { arrayField: 1 } ] } } }

const getFieldWrapper = (fieldPath, data) => {
  const pathToFieldWrapper = fieldPath.slice(0, -1);

  if (!pathToFieldWrapper.length) return data;

  const firstKey = pathToFieldWrapper[0];
  let fieldWrapper = data[firstKey];

  for (let i = 1; i < pathToFieldWrapper.length; i++) {
    const key = pathToFieldWrapper[i];
    fieldWrapper = fieldWrapper[key];
  }

  return fieldWrapper;
};

const setData = (value, name, wrapper) => {
  const isUndefined = typeof value === 'undefined';
  if (isUndefined) delete wrapper[name];
  else wrapper[name] = value;
};

const addDataToTest = (field, correctData) => {
  const { tests, name } = field;

  const fieldPath = name.split('.');
  const fieldName = fieldPath[fieldPath.length - 1];

  const testsWithData = tests.map((test) => {
    const newData = cloneDeep(correctData);
    const fieldWrapper = getFieldWrapper(fieldPath, newData);
    const fieldValue = test.data[fieldName];

    const isArrayWrapper = Array.isArray(fieldWrapper);

    if (isArrayWrapper) {
      for (const object of fieldWrapper) {
        setData(fieldValue, fieldName, object);
      }
      return { ...test, data: newData };
    }

    setData(fieldValue, fieldName, fieldWrapper);

    return { ...test, data: newData };
  });

  return { ...field, tests: testsWithData };
};

const dataPreparation = (fields, data) => fields.map((field) => addDataToTest(field, data));

module.exports = dataPreparation;
