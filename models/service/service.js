const { getAggregate } = require("../../utils/database");

const servicesCountAndIsTitle = require("../../pipelines/service/services-count-and-is-title");
const servicesAndTimetable = require("../../pipelines/service/services-and-timetable");
const unsuitableServices = require("../../pipelines/service/unsuitable-services");
const sessionTimeAndServicesIds = require("../../pipelines/service/session-time-and-services-ids");
const Collection = require("../utils/collection/collection");
const { SERVICE, TIMETABLE } = require("../../config/collection-names");
const { sortServices, bulkToSuitable, bulkToUpdatedOrder } = require("./utils");

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
    const bulkOp = this.unorderedBulkOp();
    bulkToUpdatedOrder(bulkOp, newOrder, masterId);
    await bulkOp.execute();
  }

  static async getDataForUpdate(masterId) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = sessionTimeAndServicesIds(masterId);
    return await aggregate(pipeline).next();
  }

  static async getUnsuitableServices(masterId) {
    const pipeline = unsuitableServices(masterId);
    const { services } = await this.aggregate(pipeline).next();
    const sortedServices = sortServices(services);
    return sortedServices;
  }

  static async putUpdateToServices(services) {
    const bulkOp = this.unorderedBulkOp();
    bulkToSuitable(bulkOp, services);
    await bulkOp.execute();
  }
}

module.exports = Service;
