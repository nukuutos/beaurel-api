// userId = "id" + "-" + id.toString();

// clean up userId hash when user changes userId

const userId = {
  works: value, // post, delete, put /work
  servicesAndTimetable: value, // post, delete, patch, put services, parameter-services, order, timetable /services
  unsuitableServices: value, // put update service, delete put timetable update
  city: value, // by city gets timezone on server with json file
  timetableAndAppointments: value, // change appointment status, put delete timetable update, book appointment

// first letter of status is lower case
// not implemented because of clean up: need clean master and customer cache
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

const userIdfavorites = { // post, delete /favorite
  0: value,
  1: value,
  2: value,
  "...": value
}

const masterIdBookedAppointments = { // change appointment status, put delete timetable update, book appointment
  date // ttl
}