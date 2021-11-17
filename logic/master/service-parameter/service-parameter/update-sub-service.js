const { SERVICE } = require('../../../../config/collection-names');
const { INCORRECT_DURATION } = require('../../../../config/errors/service');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const HttpError = require('../../../../models/utils/http-error');
const SubService = require('../sub-service');

class UpdateSubService extends SubService {
  static name = SERVICE;

  constructor({ subServiceId, ...subService }) {
    super(subService);
    this.id = subServiceId;
  }

  async checkDuration() {
    const { masterId, duration } = this;
    const { sessionTime } = await Timetable.findOne({ masterId }, { _id: 0, sessionTime: 1 });
    if (duration % sessionTime !== 0) throw new HttpError(INCORRECT_DURATION, 400);
    return this;
  }
}

module.exports = UpdateSubService;
