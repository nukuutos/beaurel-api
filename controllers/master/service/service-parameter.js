const ServiceParameter = require('../../../models/service/service-parameter');
const Timetable = require('../../../models/timetable/timetable');

const asyncHandler = require('../../../middleware/async-handler');

const SubService = require('../../../models/service/sub-service');

exports.addServiceParameter = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { title, subServices } = req.body;

  const serviceParameter = new ServiceParameter(masterId, title, subServices);

  await serviceParameter.checkTitleAndSetOrder();

  const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });

  const { insertedIds } = await serviceParameter.transformSubServices(sessionTime).save();

  return res.status(201).json({ ids: insertedIds, message: 'Услуга успешно добавлена!' });
});

exports.updateSubService = asyncHandler(async (req, res) => {
  const { subServiceId } = req.params;
  const { id: masterId } = req.user;
  const { parameter, duration, price } = req.body;

  const subService = new SubService({ parameter, duration, price, masterId });

  const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });

  await subService.checkDuration(sessionTime).setId(subServiceId).update();

  return res.json({ message: 'Услуга успешно обновлена!' });
});

exports.updateServiceParameter = asyncHandler(async (req, res) => {
  const { serviceTitle: currentTitle } = req.params;
  const { id: masterId } = req.user;
  const { title } = req.body;

  const serviceParameter = new ServiceParameter(masterId, title);

  await serviceParameter.checkTitle();
  await serviceParameter.updateTitle(currentTitle);

  return res.json({ message: 'Услуга успешно обновлена!' });
});

exports.deleteSubService = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { subServiceId } = req.params;

  await ServiceParameter.deleteOne({ _id: subServiceId, masterId });

  return res.json({ message: 'Параметр успешно удалён!' });
});

exports.deleteServiceParameter = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { serviceTitle } = req.params;

  await ServiceParameter.deleteMany({ masterId, title: serviceTitle });

  return res.json({ message: 'Услуга удалена!' });
});
