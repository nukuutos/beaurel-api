const { REVIEW_EXISTS } = require('../../../../config/errors/review');
const HttpError = require('../../../../models/utils/http-error');

const Review = require('./review');

class AddReview extends Review {
  constructor(review) {
    super(review);
  }

  checkReview() {
    if (this.id) throw new HttpError(REVIEW_EXISTS, 400);
    return this;
  }
}

module.exports = AddReview;
