module.exports = (customerId, status) => [
  {
    $match: {
      customerId,
      status,
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
  // {
  //   $project: {
  //     customerId: 0,
  //     reviewId: 0,
  //   },
  // },
  // {
  //   $addFields: {
  //     user: { $arrayElemAt: ["$user", 0] },
  //     review: { $arrayElemAt: ["$review", 0] },
  //     date: { $convert: { input: "$date", to: "string" } },
  //     createdAt: { $convert: { input: "$createdAt", to: "string" } },
  //   },
  // },
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
          masterId: '$masterId',
          status: '$status',
          user: '$user',
          review: '$review',
          service: '$service',
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
