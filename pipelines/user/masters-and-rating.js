module.exports = (matchQuery, page) => [
  {
    $match: { ...matchQuery, 'tools.isServices': true, 'tools.isTimetable': true },
  },

  {
    $project: {
      firstName: 1,
      lastName: 1,
      isAvatar: 1,
      placeOfWork: 1,
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
  { $sort: { rating: -1 } },
  { $skip: page * 10 },
  { $limit: 10 },
];
