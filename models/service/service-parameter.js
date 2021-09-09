const Service = require("./service");
const serviceParameter = require("../../pipelines/service/service-parameter");
const { SERVICE } = require("../../config/collection-names");

class ServiceParameter extends Service {
  static name = SERVICE;

  constructor(masterId, title, duration, price, order, subOrder, parameter) {
    super(masterId, title, duration, price, order);

    this.subOrder = subOrder;
    this.parameter = parameter;
  }

  static async get(masterId, title) {
    const pipeline = serviceParameter(masterId, title);
    return await this.aggregate(pipeline).next();
  }
}

module.exports = ServiceParameter;
