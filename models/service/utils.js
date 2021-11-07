const cloneDeep = require('lodash.clonedeep');

const bulkToUpdatedOrder = (bulkOp, newOrder, masterId) =>
  newOrder.forEach(({ id, ...order }) => {
    const find = { _id: id, masterId };
    bulkOp.update(find, order);
  });

const bulkToSuitable = (bulkOp, services) =>
  services.forEach(({ id, duration }) => {
    const findQuery = { _id: id };
    const updateQuery = { 'update.duration': duration, 'update.status': 'suitable' };
    bulkOp.update(findQuery, updateQuery);
  });

const sortSubServices = (service) => {
  const { subServices } = service;
  if (!subServices) return service;

  const sortedSubServices = subServices.mergeSort('subOrder');

  return { ...service, subServices: sortedSubServices };
};

const sortServices = (services) => {
  const copiedServices = [...services];
  const sortedServices = copiedServices.mergeSort('order');
  return sortedServices.map(sortSubServices);
};

const sortOrder = (order) =>
  order
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

const handleServiceParameter = (services, indexes, currentOrder) => {
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

const checkAndCorrectOrder = (sortedServicesOrder) => {
  const services = cloneDeep(sortedServicesOrder);

  let j = 0;
  for (let i = 0; true; i++) {
    const service = services[j];

    if (!service) break;

    const { subOrder, order } = service;

    if (subOrder !== null) {
      const subServicesNumber = handleServiceParameter(services, { i, j }, order);
      j += subServicesNumber;
    } else {
      service.order = i;
    }

    j++;
  }

  return services;
};

module.exports = {
  sortServices,
  sortOrder,
  checkAndCorrectOrder,
  bulkToUpdatedOrder,
  bulkToSuitable,
};
