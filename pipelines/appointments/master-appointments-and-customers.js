const limit = 10;

module.exports = (findQuery, page) => [
  { $match: findQuery },
  { $sort: { date: 1, 'time.startAt': 1 } },
  { $skip: page * limit },
  { $limit: limit },
  {
    $addFields: {
      status: { status: '$status', user: { $last: '$history.user' } },
    },
  },
  {
    $lookup: {
      from: 'users',
      let: {
        customerId: '$customerId',
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$customerId'] } } },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            isAvatar: 1,
            role: 1,
            username: 1,
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
    $addFields: {
      user: { $arrayElemAt: ['$user', 0] },
      review: { $arrayElemAt: ['$review', 0] },
      createdAt: { $convert: { input: '$createdAt', to: 'string' } },
    },
  },
  {
    $group: {
      _id: '$date',
      appointments: {
        $push: {
          _id: '$_id',
          status: '$status',
          user: '$user',
          review: '$review',
          service: '$service',
          isViewed: '$isViewed',
          time: '$time',
          date: { $convert: { input: '$date', to: 'string' } },
          createdAt: '$createdAt',
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      date: '$_id',
      appointments: '$appointments',
    },
  },
];
