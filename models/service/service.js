const { getAggregate } = require("../../utils/database");

const servicesCountAndIsTitle = require("../../pipelines/service/services-count-and-is-title");
const servicesAndTimetable = require("../../pipelines/service/services-and-timetable");
const unsuitableServices = require("../../pipelines/service/unsuitable-services");
const sessionTimeAndServicesIds = require("../../pipelines/service/session-time-and-services-ids");
const Collection = require("../utils/collection/collection");
const { SERVICE, TIMETABLE } = require("../../config/collection-names");
const { sortServices, bulkToSuitable, bulkToUpdatedOrder } = require("./utils");
const isEqual = require("lodash.isequal");
const HttpError = require("../utils/http-error");

const { SERVICES_AND_TIMETABLE, UNSUITABLE_SERVICES } = require("../../config/cache");

const {
  INCORRECT_SERVICES_FOR_UPDATE,
  TITLE_EXISTS,
  INCORRECT_DURATION,
} = require("../../config/errors/service");

class Service extends Collection {
  static name = SERVICE;

  constructor({ masterId, title, duration, price, order = null }) {
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

    const { services: unsortedServices, timetable } = await aggregate(pipeline)
      .cache(masterId, SERVICES_AND_TIMETABLE)
      .next();

    const services = sortServices(unsortedServices);
    return { services, timetable };
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
    const { services } = await this.aggregate(pipeline).cache(masterId, UNSUITABLE_SERVICES).next();
    const sortedServices = sortServices(services);
    return sortedServices;
  }

  static async putUpdateToServices(services) {
    const servicesForUpdate = services.map(({ id, duration }) => ({ id, duration }));
    const bulkOp = this.unorderedBulkOp();
    bulkToSuitable(bulkOp, servicesForUpdate);
    await bulkOp.execute();
  }

  static async toUnsuitable({ masterId, sessionTime, date, changes }) {
    if (!changes["sessionTime"]) return 0;

    const { result } = await Service.updateMany(
      { masterId, duration: { $not: { $mod: [sessionTime, 0] } } },
      { update: { date, status: "unsuitable" } }
    );

    console.log({ masterId, duration: { $not: { $mod: [sessionTime, 0] } } });

    return result.n;
  }

  static async cancelUpdates(masterId) {
    await Service.updateMany({ masterId, update: { $exists: true, $ne: null } }, { update: null });
  }

  static checkServicesForUpdate(servicesClient, servicesDB) {
    if (servicesDB.length !== servicesClient.length) {
      throw new HttpError(INCORRECT_SERVICES_FOR_UPDATE, 400);
    }

    servicesClient = servicesClient.map(({ id }) => id.toString());

    const isIdsEqual = isEqual(servicesDB.sort(), servicesClient.sort());
    if (!isIdsEqual) throw new HttpError(INCORRECT_SERVICES_FOR_UPDATE, 400);

    return this;
  }

  static checkServicesForDuration(services, sessionTime) {
    services
      .map(({ duration }) => new Service({ duration }))
      .forEach((service) => service.checkDuration(sessionTime));

    return this;
  }

  async checkTitleAndSetOrder() {
    const { masterId, title } = this;

    const pipeline = servicesCountAndIsTitle(masterId, title);
    const { count, isTitle } = await Service.aggregate(pipeline).next();

    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);

    this.order = count;

    return count;
  }

  async checkTitle() {
    const { id, masterId, title } = this;

    const isTitle = await Service.findOne(
      { _id: { $ne: id || null }, masterId, title },
      { _id: 1 }
    );

    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }

  async update() {
    const { id, title, duration, price } = this;
    await Service.updateOne({ _id: id }, { title, duration, price });
  }

  checkDuration(sessionTime) {
    const { duration } = this;
    if (duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);
    return this;
  }

  setId(id) {
    this.id = id;
    return this;
  }
}

module.exports = Service;
