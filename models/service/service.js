const { getAggregate } = require("../../utils/database");

const servicesCountAndIsTitle = require("../../pipelines/service/services-count-and-is-title");
const servicesAndTimetable = require("../../pipelines/service/services-and-timetable");
const unsuitableServices = require("../../pipelines/service/unsuitable-services");
const sessionTimeAndServicesIds = require("../../pipelines/service/session-time-and-services-ids");
const Collection = require("../utils/collection/collection");
const { SERVICE, TIMETABLE } = require("../../config/collection-names");

class Service extends Collection {
  static name = SERVICE;

  constructor(masterId, title, duration, price, order) {
    super();

    this.masterId = masterId;
    this.title = title;
    this.duration = duration;
    this.price = price;
    this.order = order;
    this.subOrder = null;
    this.parameter = null;
  }

  static async getServicesAndTimetable(masterId) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = servicesAndTimetable(masterId);
    return await aggregate(pipeline).next();
  }

  static async getServiceCounterAndIsTitleExists(masterId, title) {
    const pipeline = servicesCountAndIsTitle(masterId, title);
    return await this.aggregate(pipeline).next();
  }

  static async updateOrder(newOrder, masterId) {
    const bulkOp = this.orderedBulkOp(); // why ordered?

    newOrder.forEach(({ id, ...order }) => {
      bulkOp.find({ _id: id, masterId }).updateOne({ $set: order });
    });

    await bulkOp.execute();
  }

  static async getDataForUpdate(masterId) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = sessionTimeAndServicesIds(masterId);
    return await aggregate(pipeline).next();
  }

  static async getUnsuitableServices(masterId) {
    const pipeline = unsuitableServices(masterId);
    const data = await this.aggregate(pipeline).next();

    let { services } = data;

    // indexes or good sort algo, okay?
    // sort subServices
    services = services.map((service) => {
      if (!service.subServices) return service;
      service.subServices.sort((a, b) => a.subOrder - b.subOrder);
      return service;
    });

    // sort services
    services = services.sort((a, b) => a.order - b.order);

    return services;
  }

  static async putUpdateToServices(services) {
    const bulkOp = this.unorderedBulkOp();

    services.forEach(({ id, duration }) => {
      bulkOp
        .find({ _id: id })
        .updateOne({ $set: { "update.duration": duration, "update.status": "suitable" } });
    });

    await bulkOp.execute();
  }
}

module.exports = Service;
