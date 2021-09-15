const bulkToUpdatedOrder = (bulkOp, newOrder, masterId) =>
  newOrder.forEach(({ id, ...order }) => {
    const find = { _id: id, masterId };
    bulkOp.update(find, order);
  });

const bulkToSuitable = (bulkOp, services) =>
  services.forEach(({ id, duration }) => {
    const findQuery = { _id: id };
    const updateQuery = { "update.duration": duration, "update.status": "suitable" };
    bulkOp.update(findQuery, updateQuery);
  });

const sortSubServices = (service) => {
  const { subServices } = service;
  if (!subServices) return service;

  const sortedSubServices = subServices.mergeSort("subOrder");
  service.subServices = sortedSubServices;

  return service;
};

const sortServices = (services) => {
  const copiedServices = [...services];
  const sortedServices = copiedServices.mergeSort("order");
  return sortedServices.map(sortSubServices);
};

module.exports = { sortServices, bulkToUpdatedOrder, bulkToSuitable };
