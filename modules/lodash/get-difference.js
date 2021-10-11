const lodash = require("lodash");
const isEqual = require("lodash.isequal");

lodash.mixin({
  getDifference: function (obj1, obj2) {
    const difference = {};

    for (let key in obj1) {
      const areKeysEqual = isEqual(obj1[key], obj2[key]);
      if (!areKeysEqual) difference[key] = 1;
    }

    return difference;
  },
});
