const isEqual = require("lodash.isequal");
const { REVIEW, APPOINTMENT } = require("../config/collection-names");
const { getAggregate } = require("../utils/database");
const appointmentWithReview = require("../pipelines/review/appointment-with-review");
const Collection = require("./utils/collection/collection");
const HttpError = require("./utils/http-error");
const {
  NO_APPOINTMENT,
  REVIEW_EXISTS,
  NO_REVIEW,
  ADD_REVIEW_TO_YOURSELF,
} = require("../config/errors/review");

const { NODE_ENV } = process.env;

class Review extends Collection {
  static name = REVIEW;

  constructor({ masterId, customerId, appointmentId, value = null, comment = null }) {
    super();

    this.masterId = masterId;
    this.customerId = customerId;
    this.appointmentId = appointmentId;
    this.value = value;
    this.comment = comment;
    this.createdAt = new Date();
  }

  async checkAppointmentAndReview(method) {
    const { appointmentId, masterId, customerId } = this;
    const aggregate = getAggregate(APPOINTMENT);
    const pipeline = appointmentWithReview(appointmentId, masterId, customerId, "history");
    const { _id: isAppointment, review: isReview } = await aggregate(pipeline).next();

    if (!isAppointment) throw new HttpError(NO_APPOINTMENT, 404);

    this.handleReviewExceptions(isReview, method);
  }

  async save() {
    const { appointmentId, masterId, customerId, value, comment, createdAt } = this;
    const find = { appointmentId, masterId, customerId };
    const update = { value, comment, createdAt };
    const options = { upsert: true };
    await Review.updateOne(find, update, options);
  }

  handleReviewExceptions(isReview, method) {
    if (isReview && method === "add") throw new HttpError(REVIEW_EXISTS, 400);
    if (!isReview && method === "update") throw new HttpError(NO_REVIEW, 404);
  }

  checkMasterAndCustomer() {
    const { customerId, masterId } = this;

    if (NODE_ENV !== "development" && isEqual(customerId, masterId)) {
      throw new HttpError(ADD_REVIEW_TO_YOURSELF, 400);
    }

    return this;
  }

  addValueAndComment(value, comment) {
    this.value = value;
    this.comment = comment;

    return this;
  }
}

module.exports = Review;
