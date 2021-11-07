const Appointment = require('../../../models/appointment/appointment');

const asyncHandler = require('../../../middleware/async-handler');

const BookingController = require('../../../models/appointment/booking-controller/booking-controller');
const BookingAutoController = require('../../../models/appointment/booking-controller/booking-auto-controller');
const BookingManuallyController = require('../../../models/appointment/booking-controller/booking-manually-controller');

exports.bookAppointment = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { id: customerId } = req.user;
  const { serviceId, time, date } = req.body;

  const data = await Appointment.getInfoForBookingAppointment(masterId, serviceId, date.toDate());

  const { timetable, bookedAppointments, service } = data;

  let booking = new BookingController({
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
    booking = new BookingAutoController(booking);
    booking.isWeekend().isException().isOverWorkingDay().getFreeAppointments().checkAvailability();
  } else {
    booking = new BookingManuallyController(booking);
    booking.isTimeExist().checkAvailability();
  }

  await booking.createAppointment().save();

  return res.status(201).json({ message: 'Запись забронирована!' });
});
