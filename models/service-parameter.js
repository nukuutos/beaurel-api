const Service = require('./service');
const serviceParameter = require('../pipelines/service/service-parameter');
const { SERVICE } = require('../config/collection-names');
const SubService = require('../logic/master/service-parameter/sub-service');

class ServiceParameter extends Service {
  static name = SERVICE;

  constructor(masterId, title, subServices) {
    super({ masterId, title });

    this.subServices = subServices;
    this.order = null;
  }

  static async get(masterId, title) {
    const pipeline = serviceParameter(masterId, title);
    return await this.aggregate(pipeline).next();
  }

  async save() {
    return await ServiceParameter.insertMany(this.subServices);
  }

  async updateTitle(currentTitle) {
    const { title, masterId } = this;
    await ServiceParameter.updateMany({ masterId, title: currentTitle }, { title });
  }
}

module.exports = ServiceParameter;
