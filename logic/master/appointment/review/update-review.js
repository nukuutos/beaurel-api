const { NO_REVIEW } = require('../../../../config/errors/review');
const HttpError = require('../../../../models/utils/http-error');

const Review = require('./review');

class UpdateReview extends Review {
  constructor(review) {
    super(review);
  }

  checkReview() {
    if (!this.id) throw new HttpError(NO_REVIEW, 404);
    return this;
  }
}

module.exports = UpdateReview;
