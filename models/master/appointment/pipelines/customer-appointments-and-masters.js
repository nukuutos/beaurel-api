module.exports = (customerId, status) => [
  {
    $match: {
      customerId,
      status: status,
    },
  },
  {
    $lookup: {
      from: 'users',
      let: {
        masterId: '$masterId',
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$masterId'] } } },
        {
          $project: {
            // _id: { $convert: { input: '$_id', to: 'string' } },
            firstName: 1,
            lastName: 1,
            avatar: 1,
          },
        },
      ],
      as: 'user',
    },
  },
  {
    $lookup: {
      from: 'reviews',
      let: {
        appointmentId: '$_id',
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$appointmentId', '$$appointmentId'] } } },
        {
          $project: {
            customerId: 0,
            masterId: 0,
          },
        },
      ],
      as: 'review',
    },
  },
  {
    $project: {
      customerId: 0,
      reviewId: 0,
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$user', 0] },
      review: { $arrayElemAt: ['$review', 0] },
      date: { $convert: { input: '$date', to: 'string' } },
      createdAt: { $convert: { input: '$createdAt', to: 'string' } },
    },
  },
];
