module.exports = (masterId, status) => [
  {
    $match: {
      masterId,
      status,
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
            avatar: 1,
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
  // { $sort: { date: 1 } },
  {
    $group: {
      _id: { $dateToString: { format: '%d-%m-%Y', date: '$date' } },
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
    $group: {
      _id: null,
      appointments: { $push: { k: '$_id', v: '$appointments' } },
    },
  },
  {
    $project: {
      _id: 0,
      appointments: { $arrayToObject: '$appointments' },
    },
  },
  { $replaceRoot: { newRoot: '$appointments' } },
];
