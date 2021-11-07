const Service = require('../../../models/service/service');
const Timetable = require('../../../models/timetable/timetable');
const HttpError = require('../../../models/utils/http-error');

const asyncHandler = require('../../../middleware/async-handler');
const { NO_UPDATED_SESSION_TIME } = require('../../../config/errors/service');

exports.getServices = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const data = await Service.getServicesAndTimetable(masterId);

  return res.json(data);
});

exports.addService = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { title, duration, price } = req.body;

  const service = new Service({ masterId, title, duration, price });

  await service.checkTitleAndSetOrder();

  const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });

  const { insertedId: id } = await service.checkDuration(sessionTime).save();

  return res.status(201).json({ id, message: 'Услуга успешно добавлена!' });
});

exports.updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { id: masterId } = req.user;
  const { title, duration, price } = req.body;

  const service = new Service({ masterId, title, duration, price });

  await service.setId(serviceId).checkTitle();

  const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });

  await service.checkDuration(sessionTime).update();

  return res.json({ message: 'Услуга обновлена!' });
});

exports.deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { id: masterId } = req.user;

  await Service.deleteOne({ _id: serviceId, masterId });

  return res.json({ message: 'Услуга удалена!' });
});

exports.updateServicesOrder = asyncHandler(async (req, res) => {
  const { newOrder } = req.body;
  const { id: masterId } = req.user;

  await Service.checkOrderLength(masterId, newOrder);

  const validOrder = Service.checkAndCorrectOrder(newOrder);

  await Service.updateOrder(validOrder, masterId);

  res.status(204).end();
});

exports.getUnsuitableServices = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;

  const unsuitableServices = await Service.getUnsuitableServices(masterId);

  res.json({ unsuitableServices });
});

exports.putUpdateToServices = asyncHandler(async (req, res) => {
  const { services } = req.body;
  const { id: masterId } = req.user;

  const { sessionTime, services: servicesIds } = await Service.getDataForUpdate(masterId);

  if (!sessionTime) throw new HttpError(NO_UPDATED_SESSION_TIME, 404);

  await Service.checkServicesForUpdate(services, servicesIds)
    .checkServicesForDuration(services, sessionTime)
    .putUpdateToServices(services);

  res.json({ message: 'Обновление успешно добавлено к услугам!' });
});
