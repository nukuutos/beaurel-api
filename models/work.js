const Collection = require('./utils/collection/collection');
const { WORK } = require('../config/collection-names');

class Work extends Collection {
  static name = WORK;

  constructor(masterId, title) {
    super();

    this.masterId = masterId;
    this.title = title;
  }
}

module.exports = Work;
