const asyncHandler = require('../../middleware/async-handler');
const GetServices = require('../../logic/master/service/get-services');
const AddService = require('../../logic/master/service/add-service');
const UpdateService = require('../../logic/master/service/update-service');
const DeleteService = require('../../logic/master/service/delete-service');
const UpdateServicesOrder = require('../../logic/master/service/update-services-order');
const GetUnsuitableServices = require('../../logic/master/service/get-unsuitable-services');
const PutUpdateToServices = require('../../logic/master/service/put-update-to-services');

exports.getServices = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const data = await GetServices.getData(masterId);

  return res.json(data);
});

exports.addService = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { title, duration, price, updateDuration } = req.body;

  const service = new AddService({ masterId, title, duration, price, updateDuration });

  await service.getData();
  await service.checkLimit().checkTitle().setOrder().isUpdateDuration().checkDuration();

  const { insertedId: id } = await service.save();

  service.updateMasterTools();

  return res.status(201).json({ id, message: 'Услуга успешно добавлена!' });
});

exports.updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { id: masterId } = req.user;
  const { title, duration, price } = req.body;

  const service = new UpdateService({ id: serviceId, masterId, title, duration, price });

  await service.checkTitle();
  await service.checkDuration();
  await service.updateOne();

  return res.json({ message: 'Услуга обновлена!' });
});

exports.deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { id: masterId } = req.user;

  const service = new DeleteService(serviceId, masterId);
  await service.delete();

  return res.json({ message: 'Услуга удалена!' });
});

exports.updateServicesOrder = asyncHandler(async (req, res) => {
  const { newOrder } = req.body;
  const { id: masterId } = req.user;

  const order = new UpdateServicesOrder(newOrder, masterId);

  await order.checkLength();

  await order.sort().correct().update();

  res.status(204).end();
});

exports.getUnsuitableServices = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;

  const unsuitableServices = await GetUnsuitableServices.getData(masterId);

  res.json({ unsuitableServices });
});

exports.putUpdateToServices = asyncHandler(async (req, res) => {
  const { services: servicesClient } = req.body;
  const { id: masterId } = req.user;

  const services = new PutUpdateToServices(servicesClient, masterId);
  await services.getDataForUpdate();
  await services.checkForUpdate().checkDuration().putUpdate();

  res.json({ message: 'Обновление успешно добавлено к услугам!' });
});
