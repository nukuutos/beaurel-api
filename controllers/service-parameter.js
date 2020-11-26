const Service = require('../models/service');
const Timetable = require('../models/timetable');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { getCorrectSessionTime } = require('./utils/service');

exports.addSubService = asyncHandler(async (req, res, next) => {
  const { masterId, serviceTitle } = req.params;
  let { service, date } = req.body;

  const { order, subServices } = await Service.getServiceParameter(masterId, serviceTitle); // we need  service parameter length and order

  const subServicesCount = subServices.length;
  for (let i = 0; i < subServicesCount; i++) {
    if (subServices[i].parameter === service.parameter)
      return next(new HttpError('You already have service with this parameter'));
  }

  const timetable = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1, update: 1 }); // to get service counter and is tit exists?

  const sessionTime = getCorrectSessionTime(timetable, date); // for updates in session time
  if (!sessionTime) return next(new HttpError('Incorrect session time'));

  const { duration, price, parameter } = service;
  if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));

  service = new Service(masterId, serviceTitle, duration, price, order, subServicesCount, parameter);
  const { insertedId } = await service.save();
  // can i do id instead of ids here?
  return res.json({ ids: insertedId, message: 'Sub Service is added!', type: 'success' });
  // return res.json({ message: 'Service is added!', type: 'success' });
});

exports.addServiceParameter = asyncHandler(async (req, res, next) => {
  // DRY
  const { masterId } = req.params;
  const { service, date } = req.body;

  const { isTitle, servicesCount } = await Service.getServiceCounterAndIsTitleExists(masterId, service.title);

  if (isTitle) return next(new HttpError('You already have service with this title'));

  const timetable = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1, update: 1 });

  const sessionTime = getCorrectSessionTime(timetable, date);
  if (!sessionTime) return next(new HttpError('Incorrect session time'));
  // DRY

  for (let i = 0; i < service.subServices.length; i++) {
    const { duration } = service.subServices[i];
    if (duration % sessionTime !== 0) return next(new HttpError('Incorrect duration'));

    // add order to sub service
    service.subServices[i].order = servicesCount || 0;
    service.subServices[i].subOrder = i;
  }

  const { insertedIds } = await Service.saveServiceParameter(service, masterId); // insertedIds object

  return res.json({ ids: insertedIds, message: 'Service is added!', type: 'success' });
});

exports.updateSubService = asyncHandler(async (req, res, next) => {
  const { masterId, subServiceId } = req.params;
  const { date, service } = req.body;

  const { duration } = service;

  const timetable = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1, update: 1 });
  // Get timetable: current or updated sessionTime
  const sessionTime = getCorrectSessionTime(timetable, date);
  if (!sessionTime) return next(new HttpError('Incorrect session time'));

  if (duration % sessionTime !== 0) return next(new HttpError('Duration is incorrect', 400));

  await Service.updateOne({ _id: subServiceId }, { ...service });

  return res.json({ message: 'Service is updated', type: 'success' });
});

exports.updateServiceParameter = asyncHandler(async (req, res, next) => {
  const { masterId, serviceTitle } = req.params; // old title
  const { title } = req.body.service; // new title

  const isTitleExisted = await Service.findOne({ masterId, title }, { _id: 1 });
  if (isTitleExisted) return next(new HttpError('You already have service with this title'));

  await Service.updateMany({ masterId, title: serviceTitle }, { title });

  return res.json({ message: 'Service is updated', type: 'success' });
});

exports.deleteSubService = asyncHandler(async (req, res, next) => {
  const { subServiceId } = req.params;

  await Service.deleteOne({ _id: subServiceId });

  return res.json({ message: 'Sub-service is deleted', type: 'success' });
});

exports.deleteServiceParameter = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  const { serviceTitle } = req.params;

  await Service.deleteMany({ masterId, title: serviceTitle });

  return res.json({ message: 'Service is deleted', type: 'success' });
});
