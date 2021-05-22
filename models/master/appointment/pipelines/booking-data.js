module.exports = (masterId, serviceId, date) => [
  //get timetable
  {
    $match: {
      masterId,
    },
  },
  {
    $project: {
      _id: 0,
      masterId: 1,
      timetable: {
        workingDay: '$workingDay',
        sessionTime: '$sessionTime',
        type: '$type',
        auto: '$auto',
        manually: '$manually',
        update: '$update',
      },
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
            status: { $nin: ['cancelled', 'unsuitable', 'rejected'] },
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
  {
    $project: {
      _id: 0,
      masterId: 0,
      workingDay: 0,
    },
  },
  {
    $lookup: {
      from: 'services',
      let: {
        serviceId,
        masterId,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$_id', '$$serviceId'],
                },
                {
                  $eq: ['$masterId', '$$masterId'],
                },
              ],
            },
          },
        },
      ],
      as: 'service',
    },
  },
  {
    $addFields: {
      service: { $arrayElemAt: ['$service', 0] },
    },
  },
];
