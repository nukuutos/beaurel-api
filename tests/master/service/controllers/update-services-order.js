const { SERVICES_ORDER_LENGTH } = require('../../../../config/errors/service');
const Service = require('../../../../models/service');
const master = require('../../../data/masters/master');

const servicesNewOrder = require('../../../data/services/services-new-order');
const servicesNewBrokenOrder = require('../../../data/services/services-new-broken-order');
const servicesForBrokenOrder = require('../../../data/services/services-for-broken-order');
const servicesWithFixedOrder = require('../../../data/services/services-with-fixed-order');

const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

module.exports = function () {
  it('should successfully update order', async () => {
    await getServices.request();
    await checkIsServiceCache();

    const response = await this.request().send({ newOrder: servicesNewOrder });

    await checkIsServiceCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(204);

    const services = await Service.find({ masterId: master._id }, { order: 1, subOrder: 1 });

    const index0 = services.findIndex(
      (service) => service._id.toString() === '6121fc9f8fce2120cc841b6b'
    );

    expect(services[index0].order).toBe(0);
    expect(services[index0].subOrder).toBe(3);

    const index1 = services.findIndex(
      (service) => service._id.toString() === '6121fc858fce2120cc841b68'
    );

    expect(services[index1].order).toBe(1);
  });

  it('should fail, invalid services length', async () => {
    const response = await this.request().send({ newOrder: servicesNewBrokenOrder });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(SERVICES_ORDER_LENGTH);
  });

  it('should successfully update order with gap and order crossing (fix it)', async () => {
    await Service.deleteMany({});
    await Service.insertMany(servicesForBrokenOrder);

    const response = await this.request().send({ newOrder: servicesNewBrokenOrder });

    const { statusCode } = response;

    expect(statusCode).toBe(204);

    const services = await Service.find({}, { order: 1, subOrder: 1 });

    expect(services).toEqual(servicesWithFixedOrder);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
