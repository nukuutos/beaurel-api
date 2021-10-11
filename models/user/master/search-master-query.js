const { USER } = require("../../../config/collection-names");
const mastersAndRating = require("../../../pipelines/master/masters-and-rating");
const Collection = require("../../utils/collection/collection");

class SearchQuery extends Collection {
  static name = USER;

  constructor(page = 0) {
    super();

    this.query = { role: "master" };
    this.page = page;
  }

  addSpecialization(specialization) {
    if (specialization.length) this.query.specialization = new RegExp(`^${specialization}`, "i");
    return this;
  }

  handleName(name) {
    if (name.includes(" ")) this.addFirstAndLastNames(name);
    else if (name.length) this.addFirstName(name);
    return this;
  }

  addFirstAndLastNames(name) {
    const [firstName, lastName] = name.split(" ").map((name) => new RegExp(`^${name}`, "i"));

    this.query.$or = [
      { firstName, lastName },
      { firstName: lastName, lastName: firstName },
    ];
    return this;
  }

  addFirstName(name) {
    const regexName = new RegExp(`^${name}`, "i");
    this.query.$or = [{ firstName: regexName }, { lastName: regexName }];
    return this;
  }

  async exec() {
    const pipeline = mastersAndRating(this.query, this.page);
    const data = await SearchQuery.aggregate(pipeline).toArray();
    return data || [];
  }
}

module.exports = SearchQuery;
