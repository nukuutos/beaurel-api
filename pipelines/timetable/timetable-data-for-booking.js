module.exports = (masterId) => [
  {
    $match: {
      masterId,
    },
  },
  {
    $project: {
      _id: 0,
      timetable: {
        sessionTime: '$sessionTime',
        timezone: '$timezone',
        auto: '$auto',
        manually: '$manually',
        type: '$type',
        update: '$update',
      },
    },
  },
  {
    $lookup: {
      from: 'users',
      let: {
        masterId,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', '$$masterId'],
            },
          },
        },
        {
          $project: {
            _id: 0,
            isServices: '$tools.isServices',
          },
        },
      ],
      as: 'user',
    },
  },
  {
    $addFields: {
      isServices: { $arrayElemAt: ['$user.isServices', 0] },
    },
  },
  {
    $project: {
      user: 0,
    },
  },
];
