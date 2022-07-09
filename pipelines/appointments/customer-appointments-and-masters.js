const limit = 10;

module.exports = (findQuery, page) => [
  { $match: findQuery },
  { $sort: { date: 1, time: 1 } },
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
        masterId: '$masterId',
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$masterId'] } } },
        {
          $project: {
            role: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            isAvatar: 1,
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
          masterId: '$masterId',
          status: '$status',
          user: '$user',
          review: '$review',
          service: '$service',
          time: '$time',
          isViewed: '$isViewed',
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
