const isEqual = require('lodash.isequal');
const { APPOINTMENT } = require('../../../../config/collection-names');
const { DEVELOPMENT } = require('../../../../config/environments');
const { ADD_REVIEW_TO_YOURSELF, NO_APPOINTMENT } = require('../../../../config/errors/review');
const ReviewModel = require('../../../../models/review');
const HttpError = require('../../../../models/utils/http-error');
const appointmentWithReview = require('../../../../pipelines/review/appointment-with-review');
const { getAggregate } = require('../../../../utils/database/database');

const { NODE_ENV } = process.env;

class Review extends ReviewModel {
  constructor(review) {
    super(review);
  }

  async checkAppointment() {
    const { appointmentId, masterId, customerId } = this;
    const aggregate = getAggregate(APPOINTMENT);
    const pipeline = appointmentWithReview(appointmentId, masterId, customerId, 'history');
    const data = await aggregate(pipeline).next();

    if (!data) throw new HttpError(NO_APPOINTMENT, 404);

    const { review } = data;

    this.id = review?._id;
  }

  async save() {
    const { appointmentId, masterId, customerId, value, comment, createdAt } = this;
    const find = { appointmentId, masterId, customerId };
    const update = { value, comment, createdAt };
    const options = { upsert: true };
    await ReviewModel.updateOne(find, update, options);
  }

  checkMasterAndCustomer() {
    const { customerId, masterId } = this;

    if (NODE_ENV !== DEVELOPMENT && isEqual(customerId, masterId)) {
      throw new HttpError(ADD_REVIEW_TO_YOURSELF, 400);
    }

    return this;
  }
}

module.exports = Review;
