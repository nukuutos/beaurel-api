const { TITLE_EXISTS } = require('../../../config/errors/service');
const Service = require('./service');
const ServiceModel = require('../../../models/service');
const HttpError = require('../../../models/utils/http-error');
const servicesCountAndIsTitle = require('../../../pipelines/service/services-count-and-is-title');
const { SERVICE } = require('../../../config/collection-names');

class AddService extends Service {
  static name = SERVICE;

  constructor(service) {
    super(service);
  }

  async checkTitleAndSetOrder() {
    const { masterId, title } = this;

    const pipeline = servicesCountAndIsTitle(masterId, title);
    const { count, isTitle } = await ServiceModel.aggregate(pipeline).next();

    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);

    this.order = count;

    return count;
  }
}

module.exports = AddService;