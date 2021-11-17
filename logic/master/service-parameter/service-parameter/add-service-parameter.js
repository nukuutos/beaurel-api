const { SERVICE } = require('../../../../config/collection-names');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const AddService = require('../../service/add-service');
const SubService = require('../sub-service');

class AddServiceParameter extends AddService {
  static name = SERVICE;

  constructor({ masterId, title, subServices }) {
    super({ masterId, title });
    this.subServices = subServices;
  }

  async transformSubServices() {
    const { title, masterId, subServices, order } = this;

    const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });

    this.subServices = subServices.map((subServiceData, i) => {
      const subService = new SubService({ ...subServiceData, title, masterId });

      subService.checkDuration(sessionTime).setOrderAndSubOrder(order || 0, i);

      return subService;
    });

    return this;
  }

  async save() {
    return await Service.insertMany(this.subServices);
  }
}

module.exports = AddServiceParameter;
