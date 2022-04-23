const FAVORITES = 'favorites';
const BOOKED_APPOINTMENTS = 'bookedAppointments';

exports.PROFILE_ID = 'profileId';
exports.MASTER_ID = 'masterId';

exports.WORKS = 'works';
exports.SERVICES_AND_TIMETABLE = 'servicesAndTimetable';
exports.UNSUITABLE_SERVICES = 'unsuitableServices';
exports.CITY = 'city';

exports.SEARCH_TIMEZONE = 'searchTimezone';
exports.SEARCH_MASTERS = 'searchMasters';

exports.BOOKED_APPOINTMENTS = BOOKED_APPOINTMENTS;
exports.FAVORITES = FAVORITES;

exports.getFavoritesCacheName = (userId) => `${userId}${FAVORITES}`;
exports.getBookedAppointmentsCacheName = (masterId) => `${masterId}${BOOKED_APPOINTMENTS}`;
