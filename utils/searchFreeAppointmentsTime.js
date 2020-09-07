// module.exports = (bookedAppointments, possibleAppointmentsTime, sessionTime) => {
//   const bookedAppointmentsCount = bookedAppointments.length;
//   const freeAppointmentsTime = [...possibleAppointmentsTime];

//   for (let i = 0; i < bookedAppointmentsCount; i++) {
//     const bookedTime = bookedAppointments[i];
//     const { startAt, endAt } = bookedTime;

//     if (freeAppointmentsTime.length === 1) return [];

//     const startIndex = possibleAppointmentsTime.indexOf(startAt);
//     const deleteCount = (endAt - startAt) / sessionTime;
//     freeAppointmentsTime.splice(startIndex, deleteCount);
//   }

//   return freeAppointmentsTime;
// };
