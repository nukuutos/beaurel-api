const Service = require('./service');
const { getDb } = require('../utils/database');
const serviceParameter = require('./pipelines/service-parameter/service-parameter');

class ServiceParameter extends Service {
  constructor(masterId, title, duration, price, order, subOrder, parameter) {
    super(masterId, title, duration, price, order);

    this.subOrder = subOrder;
    this.parameter = parameter;
  }

  static async get(masterId, title) {
    const db = getDb();

    const res = await db.collection('services').aggregate(serviceParameter(masterId, title)).toArray();

    return res[0];
  }

  static async save(service, masterId) {
    const db = getDb();

    const { title, subServices } = service;

    const services = subServices.map((service) => ({ masterId, title, ...service }));
    return await db.collection('services').insertMany(services);
  }
}

module.exports = ServiceParameter;
