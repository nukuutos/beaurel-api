exports.getTimetableAndAppointmentsForUpdate = (masterId, appointmentId, date) => [
  {
    $match: {
      masterId,
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
            status: { $nin: ['cancelled', 'unsuitable'] },
            _id: { $ne: appointmentId }, //??? was masterId
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
      // masterId: 0,
      bookedAppointments: 1,
      timetable: {
        sessionTime: '$sessionTime',
        weekends: '$weekends',
        possibleAppointmentsTime: '$possibleAppointmentsTime',
      },
      // 'timetable.workingDay': 0,
    },
  },
];
