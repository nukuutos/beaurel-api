const asyncHandler = require('../../middleware/async-handler');

const AddServiceParameter = require('../../logic/master/service-parameter/service-parameter/add-service-parameter');
const UpdateSubService = require('../../logic/master/service-parameter/service-parameter/update-sub-service');
const UpdateServiceParameter = require('../../logic/master/service-parameter/service-parameter/update-service-parameter');
const DeleteSubService = require('../../logic/master/service-parameter/service-parameter/delete-sub-service');
const DeleteServiceParameter = require('../../logic/master/service-parameter/service-parameter/delete-service-parameter');

exports.addServiceParameter = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { title, subServices } = req.body;

  const serviceParameter = new AddServiceParameter({ masterId, title, subServices });

  const servicesCount = await serviceParameter.checkTitleAndSetOrder();
  await serviceParameter.transformSubServices();

  const { insertedIds } = await serviceParameter.save();

  AddServiceParameter.updateMasterTools(masterId, servicesCount);

  return res.status(201).json({ ids: insertedIds, message: 'Услуга успешно добавлена!' });
});

exports.updateSubService = asyncHandler(async (req, res) => {
  const { subServiceId } = req.params;
  const { id: masterId } = req.user;
  const { parameter, duration, price } = req.body;

  const subService = new UpdateSubService({ subServiceId, parameter, duration, price, masterId });

  await subService.checkDuration();
  await subService.updateOne();

  return res.json({ message: 'Услуга успешно обновлена!' });
});

exports.updateServiceParameter = asyncHandler(async (req, res) => {
  const { serviceTitle: currentTitle } = req.params;
  const { id: masterId } = req.user;
  const { title: newTitle } = req.body;

  const serviceParameter = new UpdateServiceParameter({ masterId, title: currentTitle, newTitle });

  await serviceParameter.checkTitle();
  await serviceParameter.updateTitle();

  return res.json({ message: 'Услуга успешно обновлена!' });
});

exports.deleteSubService = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { subServiceId } = req.params;

  const subService = new DeleteSubService({ _id: subServiceId, masterId });

  await subService.delete();

  return res.json({ message: 'Параметр успешно удалён!' });
});

exports.deleteServiceParameter = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { serviceTitle } = req.params;

  const serviceParameter = new DeleteServiceParameter({ masterId, title: serviceTitle });

  await serviceParameter.delete();

  return res.json({ message: 'Услуга удалена!' });
});
