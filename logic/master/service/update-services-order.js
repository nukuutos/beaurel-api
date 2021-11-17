const cloneDeep = require('lodash.clonedeep');
const { SERVICE } = require('../../../config/collection-names');
const { SERVICES_ORDER_LENGTH } = require('../../../config/errors/service');
const ServiceModel = require('../../../models/service');
const Collection = require('../../../models/utils/collection/collection');
const HttpError = require('../../../models/utils/http-error');

class UpdateServicesOrder extends Collection {
  static name = SERVICE;

  constructor(order, masterId) {
    super();

    this.order = order;
    this.masterId = masterId;
    this.bulkOp = ServiceModel.unorderedBulkOp();
  }

  async update() {
    const { order, masterId, bulkOp } = this;

    order.forEach(({ id, ...data }) => {
      const find = { _id: id, masterId };
      bulkOp.update(find, data);
    });

    await bulkOp.execute();
  }

  async checkLength() {
    const { order, masterId } = this;

    const services = await ServiceModel.find({ masterId }, { _id: 1 });
    if (order.length !== services.length) throw new HttpError(SERVICES_ORDER_LENGTH, 400);
  }

  sort() {
    this.order = this.order
      .map((service) => {
        if (service.subOrder === null) service.subOrder = -1;
        return service;
      })
      .sort((a, b) => {
        if (a.order === b.order) return a.subOrder - b.subOrder;
        return a.order - b.order;
      })
      .map((service) => {
        if (service.subOrder === -1) service.subOrder = null;
        return service;
      });

    return this;
  }

  correct() {
    const services = cloneDeep(this.order);

    let j = 0;
    for (let i = 0; true; i++) {
      const service = services[j];

      if (!service) break;

      const { subOrder, order } = service;

      if (subOrder !== null) {
        const subServicesNumber = this.handleServiceParameter(services, { i, j }, order);
        j += subServicesNumber;
      } else {
        service.order = i;
      }

      j++;
    }

    this.order = services;
    return this;
  }

  handleServiceParameter = (services, indexes, currentOrder) => {
    const { i, j } = indexes;

    let k = 0;
    while (true) {
      const subService = services[j + k];

      subService.order = i;
      subService.subOrder = k;

      const { subOrder: nextSubOrder, order: nextOrder } = services[j + k + 1] || {};
      const isBreak = !nextSubOrder || nextOrder !== currentOrder;

      if (isBreak) break;

      k++;
    }

    return k;
  };
}

module.exports = UpdateServicesOrder;
