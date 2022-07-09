const dayjs = require('dayjs');
const { getReviewsCacheName } = require('../../../../../../config/cache');
const Review = require('../../../../../../models/review');
const User = require('../../../../../../models/user');
const { getCachedData } = require('../../../../../../utils/redis');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');
const reviewsData = require('../../../data/reviews-data');
const { getIsSorted } = require('./utils');

module.exports = function () {
  beforeAll(async () => {
    await User.insertMany([master, master1]);
    await Review.insertMany(reviewsData);
  });

  it('should successfully get reviews about master', async () => {
    const query = { page: 0 };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { reviews } = body;

    expect(reviews).toHaveLength(3);

    const dataForCheckSort = reviews.map((data) => dayjs(data.review.date, 'DD-MM-YYYY'));
    const isSorted = getIsSorted(dataForCheckSort);
    expect(isSorted).toBeTruthy();

    const firstCacheKey = getReviewsCacheName(master._id.toString());
    const secondCacheKey = query.page;

    const cachedData = await getCachedData(firstCacheKey, secondCacheKey);

    const parsedData = JSON.parse(cachedData);

    expect(parsedData).toHaveLength(3);
  });
};
