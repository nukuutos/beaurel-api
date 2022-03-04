const FAVORITES = 'favorites';

exports.PROFILE_ID = 'profileId';
exports.MASTER_ID = 'masterId';
exports.WORKS = 'works';
exports.SERVICES_AND_TIMETABLE = 'servicesAndTimetable';
exports.TIMETABLE_AND_APPOINTMENTS = 'timetableAndAppointments';
exports.UNSUITABLE_SERVICES = 'unsuitableServices';
exports.CITY = 'city';

exports.SEARCH_TIMEZONE = 'searchTimezone';
exports.SEARCH_MASTERS = 'searchMasters';

exports.FAVORITES = FAVORITES;
exports.getFavoritesCacheName = (userId) => `${userId}${FAVORITES}`;
