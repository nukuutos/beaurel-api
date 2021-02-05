exports.reviewsAndCustomersPipeline = (masterId) => [
  {
    $match: {
      masterId,
    },
  },
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
            _id: 0,
            id: '$_id',
            firstName: 1,
            lastName: 1,
            avatar: 1,
          },
        },
      ],
      as: 'customer',
    },
  },
  {
    $project: {
      _id: 0,
      review: { comment: '$comment', value: '$value', date: '$date' },
      customer: { $arrayElemAt: ['$customer', 0] },
      // 'customer.id': '$customerId',
      // value: 1,
      // comment: 1,
      // customerId: 1,
    },
  },
];
