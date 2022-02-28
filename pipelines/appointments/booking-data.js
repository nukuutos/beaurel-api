module.exports = (masterId, serviceId, date) => [
  {
    $match: {
      _id: serviceId,
      masterId,
    },
  },
  {
    $project: {
      _id: 0,
      service: '$$ROOT',
    },
  },
  // get appointments
  {
    $lookup: {
      from: 'appointments',
      let: {
        masterId,
      },
      pipeline: [
        {
          $match: {
            status: { $nin: ['unsuitable', 'rejected', 'history', 'cancelled', 'unanswered'] },
            $expr: {
              $and: [
                {
                  $eq: ['$masterId', '$$masterId'],
                },
                {
                  $eq: ['$date', new Date(date)],
                },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            startAt: '$time.startAt',
            endAt: '$time.endAt',
          },
        },
      ],
      as: 'bookedAppointments',
    },
  },
];
