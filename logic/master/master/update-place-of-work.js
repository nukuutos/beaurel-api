const { USER } = require('../../../config/collection-names');
const Collection = require('../../../models/utils/collection/collection');
const User = require('../../../models/user');

class UpdatePlaceOfWork extends Collection {
  static name = USER;

  constructor(masterId) {
    super();
    this._id = masterId;
  }

  async update(city, placeOfWork) {
    const { _id } = this;
    await User.updateOne({ _id }, { city, placeOfWork });
  }
}

module.exports = UpdatePlaceOfWork;
