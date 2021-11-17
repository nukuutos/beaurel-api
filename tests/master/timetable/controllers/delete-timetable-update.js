const { NO_UPDATE } = require('../../../../config/errors/timetable');
const Appointment = require('../../../../models/appointment');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const autoTimetable = require('../../../data/timetables/auto-timetable');
const autoTimetableWithUpdate = require('../../../data/timetables/auto-timetable-with-update');
const unsuitableAppointments = require('../../../data/appointments/unsuitable-appointments');
const unsuitableServices = require('../../../data/services/unsuitable-services');

const {
  getServices,
  checkIsServiceCache,
  checkIsServiceCacheDeleted,
} = require('./utils/service-cache');

const {
  getUnsuitableServices,
  checkIsUnsuitableServiceCache,
  checkIsUnsuitableServiceCacheDeleted,
} = require('./utils/unsuitable-service-cache');

const {
  getBookingData,
  checkIsBookingDataCache,
  checkIsBookingDataCacheDeleted,
} = require('./utils/booking-data-cache');

module.exports = function () {
  it('should fail, no timetable update', async () => {
    await Timetable.save(autoTimetable);

    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_UPDATE);

    await Timetable.deleteMany({});
  });

  it('should successfully delete timetable update', async () => {
    await Timetable.save(autoTimetableWithUpdate);
    await Service.insertMany(unsuitableServices);
    await Appointment.insertMany(unsuitableAppointments);

    await getServices.request();
    await getUnsuitableServices.request();
    await getBookingData.request();

    await checkIsServiceCache();
    await checkIsUnsuitableServiceCache();
    await checkIsBookingDataCache();

    const response = await this.request();

    await checkIsServiceCacheDeleted();
    await checkIsUnsuitableServiceCacheDeleted();
    await checkIsBookingDataCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const timetable = await Timetable.findOne({});
    const services = await Service.find({});
    const appointments = await Appointment.find({});

    expect(timetable.update).toBeNull();

    services.forEach((service) => {
      expect(service.update).toBeNull();
    });

    appointments.forEach((appointment) => {
      expect(appointment.status).not.toBe('unsuitable');
    });
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
