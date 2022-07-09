const limit = 20;

module.exports = (userId, page) => [
  {
    $match: {
      $or: [{ senderId: userId }, { recipientId: userId }],
    },
  },
  {
    $sort: { createdAt: -1 },
  },
  {
    $group: {
      _id: {
        $cond: {
          if: { $ne: ['$senderId', userId] },
          then: '$senderId',
          else: '$recipientId',
        },
      },
      message: { $first: '$message' },
      senderId: { $first: '$senderId' },
      createdAt: { $first: '$createdAt' },
      isUnread: { $first: '$isUnread' },
    },
  },
  { $sort: { createdAt: -1 } },
  { $skip: page * limit },
  { $limit: limit },
  {
    $lookup: {
      from: 'users',
      let: {
        userId: '$_id',
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
        {
          $project: {
            _id: { $convert: { input: '$_id', to: 'string' } },
            username: 1,
            firstName: 1,
            lastName: 1,
            isAvatar: 1,
            role: 1,
            wasOnline: 1,
          },
        },
      ],
      as: 'user',
    },
  },
  {
    $addFields: {
      _id: { $convert: { input: '$_id', to: 'string' } },
      senderId: { $convert: { input: '$senderId', to: 'string' } },
      createdAt: { $convert: { input: '$createdAt', to: 'string' } },
      user: { $first: '$user' },
    },
  },
];
