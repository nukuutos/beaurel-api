module.exports = (masterId) => [
  //get profile
  {
    $match: {
      _id: masterId,
    },
  },
  {
    $project: {
      _id: 0,
      email: 0,
      password: 0,
      isConfirmed: 0,
      role: 0,
      createdAt: 0,
    },
  },
  // get review stats(avg, review counters by value, reviews)
  {
    $lookup: {
      from: 'reviews',
      let: {
        masterId,
      },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$masterId', '$$masterId'] },
          },
        },
        {
          $facet: {
            reviews: [
              {
                $lookup: {
                  from: 'users',
                  let: {
                    customerId: '$customerId',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$customerId'] },
                      },
                    },
                    {
                      $project: {
                        _id: 0,
                        id: '$_id',
                        firstName: 1,
                        lastName: 1,
                        avatar: 1,
                      },
                    },
                  ],
                  as: 'customer',
                },
              },
              {
                $project: {
                  _id: 0,
                  review: { comment: '$comment', value: '$value', date: '$date' },
                  customer: { $arrayElemAt: ['$customer', 0] },
                  // 'customer.id': '$customerId',
                  // value: 1,
                  // comment: 1,
                  // customerId: 1,
                },
              },
            ],
            ratingStats: [
              {
                $project: {
                  _id: 0,
                  value: 1,
                },
              },
              {
                $group: {
                  _id: '$value',
                  counter: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  ratingCounters: { $push: { value: '$_id', counter: '$counter' } },
                  sumRating: { $sum: { $multiply: ['$_id', '$counter'] } },
                  overallReviewsCounter: { $sum: '$counter' },
                },
              },
              {
                $project: {
                  _id: 0,
                  ratingCounters: 1,
                  overallReviewsCounter: 1,
                  avgRating: { $divide: ['$sumRating', '$overallReviewsCounter'] },
                },
              },
            ],
          },
        },
      ],
      as: 'ratingAndReviews',
    },
  },
  {
    $addFields: {
      // 2 lvls up from [[]]
      ratingStats: { $arrayElemAt: [{ $arrayElemAt: ['$ratingAndReviews.ratingStats', 0] }, 0] },
      reviews: { $arrayElemAt: ['$ratingAndReviews.reviews', 0] },
    },
  },
  {
    $project: {
      ratingAndReviews: 0,
    },
  },
];
