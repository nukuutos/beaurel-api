const dayjs = require('dayjs');

const getFormattedAppointments = (daysWithAppointments) => {
  daysWithAppointments = daysWithAppointments.map(({ date, appointments }) => ({
    date: dayjs(date).utc().add(1, 'day'), // prevent utc +0.:00
    appointments,
  }));

  const sortedDaysWithAppointments = daysWithAppointments.sort((a, b) =>
    a.date.isBefore(b.date) ? -1 : 1
  );

  const formattedAppointments = {};

  for (const day of sortedDaysWithAppointments) {
    const { date, appointments } = day;
    const stringDate = date.format('DD-MM-YYYY');
    formattedAppointments[stringDate] = appointments;
  }

  return formattedAppointments;
};

module.exports = { getFormattedAppointments };
