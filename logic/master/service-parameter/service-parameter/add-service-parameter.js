const { SERVICE } = require('../../../../config/collection-names');
const { SERVICE_LIMIT } = require('../../../../config/errors/service');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const HttpError = require('../../../../models/utils/http-error');
const AddService = require('../../service/add-service');
const SubService = require('../sub-service');

const SUB_SERVICES_LIMIT = 10;

class AddServiceParameter extends AddService {
  static name = SERVICE;

  constructor({ masterId, title, subServices }) {
    super({ masterId, title });
    this.subServices = subServices;
  }

  async transformSubServices() {
    const { title, masterId, subServices, order } = this;

    const { sessionTime, update } = await Timetable.findOne(
      { masterId },
      { _id: 0, sessionTime: 1, update: 1 }
    );

    this.subServices = subServices.map((subServiceData, i) => {
      const subService = new SubService({ ...subServiceData, title, masterId });

      subService
        .isUpdateDuration()
        .checkDuration(sessionTime, update)
        .setOrderAndSubOrder(order || 0, i);

      return subService;
    });

    return this;
  }

  checkSubServicesLimit() {
    const isLimit = this.subServices.length > SUB_SERVICES_LIMIT;
    if (isLimit) throw new HttpError(SERVICE_LIMIT, 400);
    return this;
  }

  async save() {
    return await Service.insertMany(this.subServices);
  }
}

module.exports = AddServiceParameter;
