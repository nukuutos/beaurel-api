const asyncHandler = require('../../../middleware/async-handler');

const Booking = require('../../../logic/master/appointment/appointment/booking-controllers/booking');
const BookingAuto = require('../../../logic/master/appointment/appointment/booking-controllers/booking-auto');
const BookingManually = require('../../../logic/master/appointment/appointment/booking-controllers/booking-manually');
const BookAppointment = require('../../../logic/master/appointment/appointment/book-appointment');
const UpdateUnsuitableAppointment = require('../../../logic/master/appointment/appointment/update-unsuitable-appointment');
const UpdateViewedState = require('../../../logic/master/appointment/appointment/update-viewed-state');

exports.bookAppointment = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { id: customerId } = req.user;
  const { serviceId, time, date } = req.body;

  const data = await BookAppointment.getData(masterId, serviceId, date.toDate());

  const { timetable, bookedAppointments, service } = data;

  let booking = new Booking({
    timetable,
    bookedAppointments,
    service,
    date,
    time,
    customerId,
  });

  booking.isService().getWorkingTimetable().getWorkingService().checkDuration();

  const { type } = booking.timetable;

  if (type === 'auto') {
    booking = new BookingAuto(booking);
    booking.isWeekend().isException().isOverWorkingDay().getFreeAppointments().checkAvailability();
  } else {
    booking = new BookingManually(booking);
    booking.isTimeExist().checkAvailability();
  }

  await booking.getCorrectStatus().setIsViewed().createAppointment().save();

  booking.sendAppointmentToClient();

  return res.status(201).json({ message: 'Запись забронирована!' });
});

exports.updateViewedState = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { id: userId } = req.user;
  const { role } = req.body;

  UpdateViewedState.update({ appointmentId, userId, role });

  return res.end();
});

exports.updateUnsuitableAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { id: masterId } = req.user;
  const { time, date, duration } = req.body;

  const data = await UpdateUnsuitableAppointment.getData(masterId, appointmentId, date.toDate());

  const { timetable, appointment, bookedAppointments } = data;

  const updateAppointment = new UpdateUnsuitableAppointment({
    appointment,
    timetable,
    duration,
    bookedAppointments,
    date,
    time,
    masterId,
  });

  updateAppointment.checkStatus().getWorkingTimetable().checkDuration();

  const { type } = updateAppointment.timetable;

  let checkAppointment;

  if (type === 'auto') {
    checkAppointment = new BookingAuto(updateAppointment);
    checkAppointment
      .isWeekend()
      .isException()
      .isOverWorkingDay()
      .getFreeAppointments()
      .checkAvailability();
  } else {
    checkAppointment = new BookingManually(updateAppointment);
    checkAppointment.isTimeExist().checkAvailability();
  }

  await updateAppointment.setIsViewed().update();

  return res.status(200).json({ message: 'Запись обновлена!' });
});
