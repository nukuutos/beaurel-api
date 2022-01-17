module.exports = (senderId, recipientId) => [
  {
    $facet: {
      sender: [
        {
          $match: {
            _id: senderId,
          },
        },
        {
          $project: { firstName: 1, lastName: 1, avatar: 1, username: 1 },
        },
      ],
      recipient: [
        {
          $match: {
            _id: recipientId,
          },
        },
        {
          $project: { _id: 1 },
        },
      ],
    },
  },
  {
    $addFields: {
      sender: { $arrayElemAt: ['$sender', 0] },
      recipient: { $arrayElemAt: ['$recipient', 0] },
    },
  },
];
