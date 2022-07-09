module.exports = (userId) => [
  {
    $match: {
      role: 'master',
    },
  },
  {
    $facet: {
      favoriteMasters: [
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
      ],
      masters: [
        // city
        // {
        //   $match: {
        //     city: 'vdk'
        //   }
        // },
        {
          $limit: 10,
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            isAvatar: 1,
            placeOfWork: 1,
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
    },
  },
];
