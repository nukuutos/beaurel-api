module.exports = (masterId) => [
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
            $expr: {
              $and: [
                {
                  $eq: ['$masterId', '$$masterId'],
                },
                {
                  $gte: ['$date', new Date()], // gt
                },
              ],
            },
            status: { $nin: ['cancelled', 'unsuitable', 'history', 'rejected'] },
          },
        },
        {
          $group: {
            // _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            _id: { $dateToString: { format: '%d-%m-%Y', date: '$date' } },
            bookedAppointments: { $push: { startAt: '$time.startAt', endAt: '$time.endAt' } },
          },
        },

        // group it in one array
        {
          $group: {
            _id: null,
            bookedAppointments: { $push: { k: '$_id', v: '$bookedAppointments' } },
          },
        },
        // restructure data to {"date" : "[bookedAppointments]"}
        {
          $project: {
            _id: 0,
            bookedAppointments: { $arrayToObject: '$bookedAppointments' },
          },
        },
      ],
      as: 'appointments',
    },
  },
  {
    $project: {
      _id: 0,
      appointments: { $arrayElemAt: ['$appointments.bookedAppointments', 0] },
      // appointments: 1,
      timetable: {
        sessionTime: '$sessionTime',
        timezone: '$timezone',
        auto: '$auto',
        manually: '$manually',
        type: '$type',
        update: '$update',
        // weekends: '$autoweekends',
        // possibleAppointmentsTime: '$possibleAppointmentsTime',
      },
      // 'timetable.workingDay': 0,
    },
  },
];
