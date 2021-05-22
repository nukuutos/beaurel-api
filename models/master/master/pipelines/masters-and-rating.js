module.exports = (matchQuery) => [
  {
    $match: matchQuery,
  },

  {
    $project: {
      firstName: 1,
      lastName: 1,
      avatar: 1,
      placeOfwork: 1,
      specialization: 1,
    },
  },
  // rating
  {
    $lookup: {
      from: 'reviews',
      let: {
        masterId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$masterId', '$$masterId'] },
          },
        },
        {
          $group: {
            _id: null,
            rating: { $avg: '$value' },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ],
      as: 'rating',
    },
  },
  {
    $addFields: {
      rating: { $arrayElemAt: ['$rating.rating', 0] },
    },
  },
];
