const Collection = require('./utils/collection/collection');
const { SERVICE } = require('../config/collection-names');

class Service extends Collection {
  static name = SERVICE;

  constructor({ masterId, title, duration, price, order = null }) {
    super();

    this.masterId = masterId;
    this.title = title;
    this.duration = duration;
    this.price = price;
    this.order = order;
    this.subOrder = null;
    this.parameter = null;
  }
}

module.exports = Service;
