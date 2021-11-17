const cloneDeep = require('lodash.clonedeep');
const { INCORRECT_DURATION } = require('../../../config/errors/service');
const ServiceModel = require('../../../models/service');
const Timetable = require('../../../models/timetable');
const HttpError = require('../../../models/utils/http-error');

class Service extends ServiceModel {
  constructor(service) {
    super(service);
  }

  async checkDuration() {
    const { duration, masterId } = this;

    const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });

    if (duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);

    return this;
  }

  static sortServices(services) {
    const copiedServices = cloneDeep(services);
    const sortedServices = copiedServices.mergeSort('order');
    return sortedServices.map(this.sortSubServices);
  }

  static sortSubServices = (service) => {
    const { subServices } = service;
    if (!subServices) return service;

    const sortedSubServices = subServices.mergeSort('subOrder');

    return { ...service, subServices: sortedSubServices };
  };
}

module.exports = Service;
