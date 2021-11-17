const { UNSUITABLE_SERVICES } = require('../../../config/cache');
const { SERVICE } = require('../../../config/collection-names');
const unsuitableServices = require('../../../pipelines/service/unsuitable-services');
const Service = require('./service');

class GetUnsuitableServices extends Service {
  static name = SERVICE;

  static async getData(masterId) {
    const pipeline = unsuitableServices(masterId);
    const { services } = await this.aggregate(pipeline).cache(masterId, UNSUITABLE_SERVICES).next();
    const sortedServices = this.sortServices(services);
    return sortedServices;
  }
}

module.exports = GetUnsuitableServices;
