const getDb = require('../utils/database').getDb;

const {
  serviceAndTimetablePipeline,
  serviceByMasterIdPipeline,
  servicesAndTimetablePipeline,
} = require('./pipelines/service');

class Service {
  constructor(masterId, title, duration, price, parameter = null) {
    this.masterId = masterId;
    this.title = title;
    this.duration = duration;
    this.price = price;
    this.parameter = parameter;
  }

  async saveService() {
    const db = getDb();

    return await db.collection('services').insertOne(this);
  }

  static async saveServiceParameters(service, masterId) {
    const db = getDb();
    // const batch = db.collection('services').initializeUnorderedBulkOp({ useLegacyOps: true });

    const { title, subServices } = service;

    const services = subServices.map((service) => ({ masterId, title, ...service }));
    return await db.collection('services').insertMany(services);
    // try {
    // } catch (error) {
    //   throw new Error();
    // }
  }
  // goes to profile or mb user?
  static async getServiceAndTimetable(serviceId, masterId) {
    const db = getDb();

    try {
      const serviceAndTimetable = await db
        .collection('services')
        .aggregate(serviceAndTimetablePipeline(serviceId, masterId))
        .toArray();

      return serviceAndTimetable[0];
    } catch (error) {
      throw new Error();
    }
  }

  static async getServicesAndTimetable(masterId) {
    const db = getDb();

    const servicesAndTimetable = await db
      .collection('timetables')
      .aggregate(servicesAndTimetablePipeline(masterId))
      .toArray();

    return servicesAndTimetable[0];
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    try {
      return await db.collection('services').findOne(query, { projection: projection });
    } catch (error) {
      throw new Error();
    }
  }

  static async updateOne(query, update) {
    const db = getDb();
    try {
      return await db.collection('services').updateOne(query, { $set: update });
    } catch (error) {
      throw new Error();
    }
  }

  static async updateMany(query, update) {
    const db = getDb();
    // try {
    return await db.collection('services').updateMany(query, { $set: update });
    // } catch (error) {
    //   throw new Error();
    // }
  }

  static async deleteOne(query) {
    const db = getDb();
    try {
      return await db.collection('services').deleteOne(query);
    } catch (error) {
      throw new Error();
    }
  }

  static async deleteMany(query) {
    const db = getDb();
    try {
      return await db.collection('services').deleteMany(query);
    } catch (error) {
      throw new Error();
    }
  }

  static async getServicesByMasterId(masterId) {
    const db = getDb();
    const services = await db.collection('services').aggregate(serviceByMasterIdPipeline(masterId)).toArray();

    return services;
  }

  static async updateService(serviceId, masterId, service) {
    const db = getDb();

    try {
      return await db.collection('services').updateOne({ _id: serviceId, masterId }, { $set: { ...service } });
    } catch (error) {
      throw new Error();
    }
  }

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
