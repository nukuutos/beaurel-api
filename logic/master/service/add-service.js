const { TITLE_EXISTS, SERVICE_LIMIT } = require('../../../config/errors/service');
const Service = require('./service');
const ServiceModel = require('../../../models/service');
const HttpError = require('../../../models/utils/http-error');
const servicesCountAndIsTitle = require('../../../pipelines/service/services-count-and-is-title');
const { SERVICE } = require('../../../config/collection-names');
const User = require('../../../models/user');

const SERVICE_LIMIT_COUNT = 20;

class AddService extends Service {
  static name = SERVICE;

  constructor(service) {
    super(service);
  }

  async getData() {
    const { masterId, title } = this;
    const pipeline = servicesCountAndIsTitle(masterId, title);
    const data = await ServiceModel.aggregate(pipeline).next();
    this.data = data;
  }

  setOrder() {
    const { count } = this.data;
    this.order = count;
    return this;
  }

  checkLimit() {
    const { count } = this.data;
    const isLimit = count >= SERVICE_LIMIT_COUNT;
    if (isLimit) throw new HttpError(SERVICE_LIMIT, 400);
    return this;
  }

  checkTitle() {
    const { isTitle } = this.data;
    if (isTitle) throw new HttpError(TITLE_EXISTS, 400);
    return this;
  }

  async save() {
    const { data, ...service } = this;
    return await Service.save(service);
  }

  // async checkTitleAndSetOrder() {
  //   const { masterId, title } = this;

  //   const pipeline = servicesCountAndIsTitle(masterId, title);
  //   const { count, isTitle } = await ServiceModel.aggregate(pipeline).next();

  //   if (isTitle) throw new HttpError(TITLE_EXISTS, 400);

  //   this.order = count;

  //   return count;
  // }

  static async updateMasterTools(masterId, count) {
    if (!count) await User.updateOne({ _id: masterId }, { 'tools.isServices': true });
  }

  async updateMasterTools() {
    const { masterId, data } = this;
    const { count } = data;
    if (!count) await User.updateOne({ _id: masterId }, { 'tools.isServices': true });
  }

  isUpdateDuration() {
    const { updateDuration } = this;

    if (updateDuration) {
      this.update = { status: 'suitable', duration: updateDuration };
    }

    return this;
  }
}

module.exports = AddService;
