const Service = require('./service');
const serviceParameter = require('../../pipelines/service/service-parameter');
const { SERVICE } = require('../../config/collection-names');
const SubService = require('./sub-service');

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

  transformSubServices(sessionTime) {
    const { title, masterId, subServices, order } = this;

    this.subServices = subServices.map((subService, i) => {
      subService = new SubService(subService);
      subService
        .checkDuration(sessionTime)
        .setOrderAndSubOrder(order || 0, i)
        .setTitleAndMasterId(title, masterId);

      return subService;
    });

    return this;
  }
}

module.exports = ServiceParameter;
