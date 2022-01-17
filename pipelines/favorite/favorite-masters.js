module.exports = (userId) => [
  {
    $match: {
      _id: userId,
    },
  },
  {
    $project: {
      _id: 0,
      masters: 1,
      ids: '$masters',
    },
  },
  // find masters profile
  {
    $lookup: {
      from: 'users',
      let: {
        masters: '$masters',
      },
      pipeline: [
        {
          $match: {
            $expr: { $in: ['$_id', '$$masters'] },
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
            placeOfWork: 1,
            specialization: 1,
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
      as: 'masters',
    },
  },
];
