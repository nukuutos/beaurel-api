module.exports = (masterId) => [
  { $match: { masterId } },
  {
    $project: {
      _id: 0,
      sessionTime: '$update.sessionTime',
    },
  },
  {
    $lookup: {
      from: 'services',
      let: {
        masterId,
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$masterId', '$$masterId'], $eq: ['$update.status', 'unsuitable'] } } },
        {
          $group: {
            _id: null,
            services: { $push: { $toString: '$_id' } },
          },
        },
        {
          $project: { _id: 0 },
        },
      ],
      as: 'services',
    },
  },
  {
    $project: {
      sessionTime: 1,
      services: { $arrayElemAt: ['$services.services', 0] },
    },
  },
];
