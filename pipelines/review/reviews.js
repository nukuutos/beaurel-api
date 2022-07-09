const LIMIT = 10;

module.exports = ({ masterId, page }) => [
  { $match: { masterId } },
  { $sort: { createdAt: -1 } },
  { $skip: page * LIMIT },
  { $limit: LIMIT },
  {
    $lookup: {
      from: 'users',
      let: {
        customerId: '$customerId',
      },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$customerId'] },
          },
        },
        {
          $project: {
            _id: { $convert: { input: '$_id', to: 'string' } },
            role: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            isAvatar: 1,
          },
        },
      ],
      as: 'customer',
    },
  },
  {
    $project: {
      _id: 0,
      review: {
        comment: '$comment',
        value: '$value',
        date: {
          $dateToString: {
            date: '$createdAt',
            format: '%d-%m-%Y',
          },
        },
      },
      customer: { $arrayElemAt: ['$customer', 0] },
    },
  },
];
