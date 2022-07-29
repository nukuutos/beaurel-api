const { SERVICES_AND_TIMETABLE } = require('../../../config/cache');
const { TIMETABLE, SERVICE } = require('../../../config/collection-names');
const servicesAndTimetable = require('../../../pipelines/service/services-and-timetable');
const { getAggregate } = require('../../../utils/database/database');
const Service = require('./service');

class GetServices extends Service {
  static name = SERVICE;

  static async getData(masterId) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = servicesAndTimetable(masterId);

    const data = await aggregate(pipeline).cache(masterId, SERVICES_AND_TIMETABLE).next();

    const { services: unsortedServices, timetable } = data || {};

    const services = this.sortServices(unsortedServices || []);
    return { services, timetable };
  }
}

module.exports = GetServices;
