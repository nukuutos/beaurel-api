const Collection = require('../../models/utils/collection/collection');
const timezoneByCity = require('../../data/timezone/timezone-to-city.json');
const HttpError = require('../../models/utils/http-error');

const { USER } = require('../../config/collection-names');
const { NO_CITY, NO_USER } = require('../../config/errors/profile');
const { CITY } = require('../../config/cache');
const User = require('../../models/user');

class GetCityAndTimezone extends Collection {
  static name = USER;

  constructor(userId) {
    super();
    this._id = userId;
  }

  async getCity() {
    const { _id } = this;

    const data = await User.cache(_id, CITY).findOne({ _id }, { _id: 0, city: 1 });

    if (!data) throw new HttpError(NO_USER, 404);

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

module.exports = GetCityAndTimezone;
