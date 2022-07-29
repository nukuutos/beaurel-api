const isEqual = require('lodash.isequal');
const { SERVICE, TIMETABLE } = require('../../../config/collection-names');
const {
  INCORRECT_SERVICES_FOR_UPDATE,
  INCORRECT_DURATION,
} = require('../../../config/errors/service');
const Collection = require('../../../models/utils/collection/collection');
const HttpError = require('../../../models/utils/http-error');
const sessionTimeAndServicesIds = require('../../../pipelines/service/session-time-and-services-ids');
const { getAggregate } = require('../../../utils/database/database');

class PutUpdateToServices extends Collection {
  static name = SERVICE;

  constructor(servicesClient, masterId) {
    super();
    this.servicesClient = servicesClient;
    this.masterId = masterId;
    this.bulkOp = PutUpdateToServices.unorderedBulkOp();
  }

  async getDataForUpdate() {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = sessionTimeAndServicesIds(this.masterId);
    const data = await aggregate(pipeline).next();

    const { sessionTime, services: servicesDB } = data || {};

    this.sessionTime = sessionTime;
    this.servicesDB = servicesDB;
  }

  checkForUpdate() {
    const { servicesClient, servicesDB } = this;

    if (servicesDB.length !== servicesClient.length) {
      throw new HttpError(INCORRECT_SERVICES_FOR_UPDATE, 400);
    }

    const servicesClientWithStringId = servicesClient.map(({ id }) => id.toString());

    const isIdsEqual = isEqual(servicesDB.sort(), servicesClientWithStringId.sort());
    if (!isIdsEqual) throw new HttpError(INCORRECT_SERVICES_FOR_UPDATE, 400);

    return this;
  }

  checkDuration() {
    const { servicesClient, sessionTime } = this;

    servicesClient.forEach((service) => {
      if (service.duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);
    });

    return this;
  }

  async putUpdate() {
    const { servicesClient, bulkOp } = this;

    const servicesForUpdate = servicesClient.map(({ id, duration }) => ({ id, duration }));

    servicesForUpdate.forEach(({ id, duration }) => {
      const findQuery = { _id: id };
      const updateQuery = { 'update.duration': duration, 'update.status': 'suitable' };
      bulkOp.update(findQuery, updateQuery);
    });

    await bulkOp.execute();
  }
}

module.exports = PutUpdateToServices;
