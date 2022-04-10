const getDataForCompare = async (getData, unpredictableFields) => {
  const projectionIncludes = Object.fromEntries(unpredictableFields.map((keyPath) => [keyPath, 1]));
  const projectionNotIncludes = Object.fromEntries(
    unpredictableFields.map((keyPath) => [keyPath, 0])
  );

  const unpredictableData = await getData(projectionIncludes);
  const predictableData = await getData(projectionNotIncludes);

  return { unpredictableData, predictableData };
};

module.exports = getDataForCompare;
