const Collection = require("../../utils/collection/collection");
const timezoneByCity = require("../../../data/timezone/city-tz.json");
const HttpError = require("../../utils/http-error");

const { USER } = require("../../../config/collection-names");
const { NO_MASTER, NO_CITY } = require("../../../config/errors/master");

class Master extends Collection {
  static name = USER;

  constructor(masterId) {
    this._id = masterId;
  }

  async getCity() {
    const { _id } = this;

    const data = await Master.findOne({ _id, role: "master" }, { _id: 0, city: 1 });

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
