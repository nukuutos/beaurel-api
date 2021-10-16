const Collection = require("../../utils/collection/collection");
const timezoneByCity = require("../../../data/timezone/city-tz.json");
const HttpError = require("../../utils/http-error");

const { USER } = require("../../../config/collection-names");
const { NO_MASTER, NO_CITY } = require("../../../config/errors/master");
const { MASTER_ID, CITY } = require("../../../config/cache");

class Master extends Collection {
  static name = USER;

  constructor(masterId) {
    super();

    this._id = masterId;
  }

  async getCity() {
    const { _id } = this;

    const data = await Master.cache(MASTER_ID, CITY).findOne(
      { _id, role: "master" },
      { _id: 0, city: 1 }
    );

    if (!data) throw new HttpError(NO_MASTER, 404);

    this.city = data.city;
  }

  getTimezone() {
    const { city } = this;

    const timezone = timezoneByCity[city];

    if (!timezone) throw new HttpError(NO_CITY, 404);

    this.timezone = timezone;

    return this;
  }
}

module.exports = Master;
