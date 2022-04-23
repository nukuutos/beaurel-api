const dayjs = require('dayjs');

// e.x

const getFormattedAppointments = (daysWithAppointments = []) => {
  daysWithAppointments = daysWithAppointments.map(({ date, appointments }) => {
    const data = {
      date: dayjs(date).utc().add(1, 'day').startOf('day'), // prevent utc +0.:00
      appointments,
    };

    const isDateInAppointment = appointments[0].date;

    if (isDateInAppointment) {
      appointments = appointments.map(({ date, ...rest }) => {
        date = dayjs(date).utc().add(1, 'day').startOf('day').toDate();
        return { ...rest, date };
      });

      data.appointments = appointments;
    }

    return data;
  });

  const sortedDaysWithAppointments = daysWithAppointments.sort((a, b) =>
    a.date.isBefore(b.date) ? 1 : -1
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
