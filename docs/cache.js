// userId = "id" + "-" + id.toString();

// clean up userId hash when user changes userId

const userId = {
  favorites: value, // post, delete
  works: value, // post, delete, put
  servicesAndTimetable: value, // post, delete, patch, put services, parameter-services, order
  tiemtableAndAppointments: value, // change appointment status, put delete timetable update, book appointment, review appointment
  unsuitableServices: value, // put update, delete put timetable update
  city: value, // by city gets timezone on server with json file

  // first letter of status is lower case
  // not implement because of clean up: need clean master and customer cache
//   masterAppointmentsonConfirmation: value, // put delete timetable update!!!, change status!, review appointment, book appointment,
//   masterAppointmentsconfirmed: value, // change status
//   "...": value,
//   customerAppointmentsonConfirmation: value,
//   customerAppointmentsconfirmed: value,
//   "...": value,
},

// 0, 1, ..., - page
// add to exception usernames: searchTimezone, searchMasters

const searchTimezone = { // manually
  "0": value,
  "1": value,
  "2": value,
  "...": value
};

const searchMasters = { // sign up or ttl
  citySpecialization0: value,
  citySpecialization1: value,
  "...": value
}