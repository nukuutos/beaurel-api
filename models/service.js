const getDb = require('../utils/database').getDb;

const {
  serviceAndTimetablePipeline,
  serviceByMasterIdPipeline,
  servicesAndTimetablePipeline,
  servicesCountAndIsExist,
  servicesCountAndIsTitleExists,
  serviceParameterPipeline,
} = require('./pipelines/service');

// Service to  ServiceParameter perhaps and SubService
class Service {
  constructor(masterId, title, duration, price, order, subOrder = null, parameter = null) {
    this.masterId = masterId;
    this.title = title;
    this.duration = duration;
    this.price = price;
    this.order = order;
    this.subOrder = subOrder;
    this.parameter = parameter;
  }

  async save() {
    const db = getDb();

    return await db.collection('services').insertOne(this);
  }

  static async saveServiceParameter(service, masterId) {
    const db = getDb();

    const { title, subServices } = service;

    const services = subServices.map((service) => ({ masterId, title, ...service }));
    return await db.collection('services').insertMany(services);
  }

  // goes to profile or mb user?
  static async getServiceAndTimetable(serviceId, masterId) {
    const db = getDb();

    const serviceAndTimetable = await db
      .collection('services')
      .aggregate(serviceAndTimetablePipeline(serviceId, masterId))
      .toArray();

    return serviceAndTimetable[0];
  }

  static async getServicesAndTimetable(masterId) {
    const db = getDb();

    const servicesAndTimetable = await db
      .collection('timetables')
      .aggregate(servicesAndTimetablePipeline(masterId))
      .toArray();

    return servicesAndTimetable[0];
  }

  static async getServiceCounterAndIsTitleExists(masterId, title) {
    const db = getDb();

    const servicesAndTimetable = await db
      .collection('services')
      .aggregate(servicesCountAndIsTitleExists(masterId, title))
      .toArray();

    return servicesAndTimetable[0];
  }

  static async getServiceParameter(masterId, title) {
    const db = getDb();

    const serviceParameter = await db
      .collection('services')
      .aggregate(serviceParameterPipeline(masterId, title))
      .toArray();

    return serviceParameter[0];
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('services').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();
    return await db.collection('services').updateOne(query, { $set: update });
  }

  static async updateMany(query, update) {
    const db = getDb();
    return await db.collection('services').updateMany(query, { $set: update });
  }

  static async deleteOne(query) {
    const db = getDb();
    return await db.collection('services').deleteOne(query);
  }

  static async deleteMany(query) {
    const db = getDb();

    return await db.collection('services').deleteMany(query);
  }

  static async getServicesByMasterId(masterId) {
    const db = getDb();
    const services = await db.collection('services').aggregate(serviceByMasterIdPipeline(masterId)).toArray();

    return services;
  }

  // static async updateService(serviceId, masterId, service) {
  //   const db = getDb();

  //   return await db.collection('services').updateOne({ _id: serviceId, masterId }, { $set: { ...service } });
  // }

  // static async deleteService(serviceId, masterId) {
  //   const db = getDb();
  //   try {
  //     return await db.collection('services').deleteOne({ _id: serviceId, masterId });
  //   } catch (error) {
  //     throw new Error();
  //   }
  // }
}

module.exports = Service;
