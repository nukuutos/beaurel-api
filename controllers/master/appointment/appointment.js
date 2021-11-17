const asyncHandler = require('../../../middleware/async-handler');

const Booking = require('../../../logic/master/appointment/appointment/booking-controllers/booking');
const BookingAuto = require('../../../logic/master/appointment/appointment/booking-controllers/booking-auto');
const BookingManually = require('../../../logic/master/appointment/appointment/booking-controllers/booking-manually');
const BookAppointment = require('../../../logic/master/appointment/appointment/book-appointment');

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

  await booking.createAppointment().save();

  return res.status(201).json({ message: 'Запись забронирована!' });
});
