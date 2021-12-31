const { TITLE_EXISTS } = require('../../../config/errors/service');
const Service = require('./service');
const ServiceModel = require('../../../models/service');
const HttpError = require('../../../models/utils/http-error');
const servicesCountAndIsTitle = require('../../../pipelines/service/services-count-and-is-title');
const { SERVICE } = require('../../../config/collection-names');

class UpdateService extends Service {
  static name = SERVICE;

  constructor({ id, ...service }) {
    super(service);
    this.id = id;
  }

  async checkTitleAndSetOrder() {
    const { masterId, title } = this;

    const pipeline = servicesCountAndIsTitle(masterId, title);
    const { count, isTitle } = await ServiceModel.aggregate(pipeline).next();

    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);

    this.order = count;

    return count;
  }

  async checkTitle() {
    const { id, masterId, title } = this;

    const isTitle = await ServiceModel.findOne(
      { _id: { $ne: id || null }, masterId, title },
      { _id: 1 }
    );

    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
  }

  async updateOne() {
    const { id, title, duration, price } = this;
    await Service.updateOne({ _id: id }, { title, duration, price });
  }
}

module.exports = UpdateService;
