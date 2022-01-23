module.exports = (profileId) => [
  // get profile and favorites
  {
    $match: {
      _id: profileId,
    },
  },
  {
    $project: {
      city: 1,
      aboutText: 1,
    },
  },
  // last appointment and stats
  {
    $lookup: {
      from: 'appointments',
      let: {
        customerId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $and: [{ status: 'history' }, { $expr: { $eq: ['$customerId', '$$customerId'] } }],
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ],
      as: 'appointmentsCount',
    },
  },
  {
    $lookup: {
      from: 'reviews',
      let: {
        customerId: '$_id',
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$customerId', '$$customerId'] } } },
        {
          $group: {
            _id: null,
            reviewsCount: { $sum: 1 },
          },
        },
      ],
      as: 'reviewsCount',
    },
  },
  {
    $addFields: {
      reviewsCount: { $arrayElemAt: ['$reviewsCount.reviewsCount', 0] },
      appointmentsCount: { $arrayElemAt: ['$appointmentsCount.count', 0] },
    },
  },
  {
    $project: {
      _id: 0,
    },
  },
];
