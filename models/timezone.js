const { TIMEZONE } = require("../config/collection-names");
const Collection = require("./utils/collection/collection");

class Timezone extends Collection {
  static name = TIMEZONE;
}

module.exports = Timezone;
