const limit = 10;

module.exports = (userId, page) => [
  {
    $match: {
      _id: userId,
    },
  },
  {
    $project: {
      _id: 0,
      masters: 1,
    },
  },
  { $unwind: '$masters' },
  { $skip: page * limit },
  { $limit: limit },
  { $project: { masterId: '$masters' } },
  // find masters profile
  {
    $lookup: {
      from: 'users',
      let: {
        masterId: '$masterId',
      },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$masterId'] },
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            isAvatar: 1,
            placeOfWork: 1,
            specialization: 1,
            role: 1,
          },
        },
        // get avg rating
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
                $project: {
                  _id: 0,
                  rating: { $avg: '$value' },
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
      ],
      as: 'master',
    },
  },
  { $replaceWith: { $arrayElemAt: ['$master', 0] } },
];
