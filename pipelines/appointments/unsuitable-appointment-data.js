module.exports = ({ masterId, appointmentId, date }) => [
  // get appointment
  {
    $facet: {
      appointment: [
        {
          $match: {
            _id: appointmentId,
          },
        },
      ],
      bookedAppointments: [
        {
          $match: {
            status: { $nin: ['cancelled', 'unsuitable', 'rejected'] },
            $expr: {
              $and: [
                {
                  $eq: ['$masterId', masterId],
                },
                {
                  $eq: ['$date', date],
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
    },
  },
  // get timetable
  {
    $lookup: {
      from: 'timetables',
      let: {
        masterId,
      },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$masterId', '$$masterId'] },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ],
      as: 'timetable',
    },
  },
  {
    $addFields: {
      timetable: { $arrayElemAt: ['$timetable', 0] },
      appointment: { $arrayElemAt: ['$appointment', 0] },
    },
  },
];
