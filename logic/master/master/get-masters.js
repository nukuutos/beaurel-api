const { USER } = require('../../../config/collection-names');
const mastersAndRating = require('../../../pipelines/master/masters-and-rating');
const { SEARCH_MASTERS } = require('../../../config/cache');
const Collection = require('../../../models/utils/collection/collection');

class GetMasters extends Collection {
  static name = USER;

  constructor(page = 0) {
    super();

    this.query = { role: 'master' };
    this.page = page;
    this.name = null;
  }

  addSpecialization(specialization) {
    this.specialization = specialization;
    if (specialization.length) this.query.specialization = new RegExp(`^${specialization}`, 'i');
    return this;
  }

  handleName(name) {
    this.name = name;

    if (name.includes(' ')) this.addFirstAndLastNames(name);
    else if (name.length) this.addFirstName(name);
    return this;
  }

  addFirstAndLastNames(name) {
    const [firstName, lastName] = name.split(' ').map((name) => new RegExp(`^${name}`, 'i'));

    this.query.$or = [
      { firstName, lastName },
      { firstName: lastName, lastName: firstName },
    ];
    return this;
  }

  addFirstName(name) {
    const regexName = new RegExp(`^${name}`, 'i');
    this.query.$or = [{ firstName: regexName }, { lastName: regexName }];
    return this;
  }

  async exec() {
    const { name, specialization, query, page } = this;

    const pipeline = mastersAndRating(query, page);

    const isNameEmpty = name === '';
    const secondCacheKey = isNameEmpty ? specialization + page : null;
    const fiveMins = 60 * 5;

    const data = await GetMasters.cache(SEARCH_MASTERS, secondCacheKey, fiveMins)
      .aggregate(pipeline)
      .toArray();

    return data || [];
  }
}

module.exports = GetMasters;
