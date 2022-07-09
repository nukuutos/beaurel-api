const { REVIEW } = require('../../../config/collection-names');
const { getReviewsCacheName } = require('../../../config/cache');
const Collection = require('../../../models/utils/collection/collection');
const reviews = require('../../../pipelines/review/reviews');

class GetReviews extends Collection {
  static name = REVIEW;

  constructor({ masterId = null, page = 0 }) {
    super();
    this.query = { masterId, page };
  }

  async getReviews() {
    const { query } = this;

    const pipeline = reviews(query);

    const firstCacheKey = getReviewsCacheName(query.masterId);
    const secondCacheKey = query.page;

    const data = await GetReviews.cache(firstCacheKey, secondCacheKey)
      .aggregate(pipeline)
      .toArray();

    return data || [];
  }
}

module.exports = GetReviews;
