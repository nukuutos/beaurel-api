module.exports = ({ masterId, startDate, endDate }) => [
  {
    $match: {
      $expr: {
        $and: [
          {
            $eq: ['$masterId', masterId],
          },
          {
            $gte: ['$date', startDate],
          },
          {
            $lt: ['$date', endDate],
          },
        ],
      },
      status: { $in: ['onConfirmation', 'confirmed'] },
    },
  },
  {
    $group: {
      _id: '$date',
      appointments: { $push: { startAt: '$time.startAt', endAt: '$time.endAt' } },
    },
  },
  {
    $project: {
      _id: 0,
      date: '$_id',
      appointments: 1,
    },
  },
];
