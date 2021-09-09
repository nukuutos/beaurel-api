exports.checkClass = (object) => {
  // typeof class === function
  // typeof object == object
  return typeof object === "function";
};

exports.getCollectionName = (object, isClass) => {
  // get collection name from class or instance
  return isClass ? object.name : object.constructor.name;
};
