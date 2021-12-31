const dayjs = require('dayjs');
const cloneDeep = require('lodash.clonedeep');
const { SERVICE } = require('../../../config/collection-names');
const { INCORRECT_DURATION, NO_UPDATE_DURATION } = require('../../../config/errors/service');
const ServiceModel = require('../../../models/service');
const Timetable = require('../../../models/timetable');
const HttpError = require('../../../models/utils/http-error');

class Service extends ServiceModel {
  static name = SERVICE;

  constructor(service) {
    super(service);
  }

  async checkDuration() {
    const { duration, masterId } = this;

    const { sessionTime, update: timetableUpdate } = await Timetable.findOne(
      { masterId },
      { _id: 0, sessionTime: 1, update: 1 }
    );

    if (duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);

    if (timetableUpdate) {
      this.checkUpdateDuration(sessionTime, timetableUpdate);
    }

    return this;
  }

  checkUpdateDuration(sessionTime, timetableUpdate) {
    if (sessionTime === timetableUpdate.sessionTime) return this;

    const { update } = this;

    if (!update) throw new HttpError(NO_UPDATE_DURATION, 400);

    if (update.duration % timetableUpdate.sessionTime !== 0) {
      throw new HttpError(INCORRECT_DURATION, 400);
    }

    this.update.date = dayjs(timetableUpdate.date).clone().toDate();

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
