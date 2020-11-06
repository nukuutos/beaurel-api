exports.bookAppointmentPipeline = (masterId, serviceId, date) => [
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
        weekends: '$weekends',
        possibleAppointmentsTime: '$possibleAppointmentsTime',
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
            status: { $nin: ['cancelled', 'unsuitable'] },
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

exports.profileAndReviewPipeline = (masterId) => [
  //get profile
  {
    $match: {
      _id: masterId,
    },
  },
  {
    $project: {
      _id: 0,
      email: 0,
      password: 0,
      isConfirmed: 0,
      role: 0,
      createdAt: 0,
    },
  },
  // get review stats(avg, review counters by value)
  {
    $lookup: {
      from: 'reviews',
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
            value: 1,
          },
        },
        {
          $group: {
            _id: '$value',
            counter: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            ratingCounters: { $push: { value: '$_id', counter: '$counter' } },
            sumRating: { $sum: { $multiply: ['$_id', '$counter'] } },
            overallReviewsCounter: { $sum: '$counter' },
          },
        },
        {
          $project: {
            _id: 0,
            ratingCounters: 1,
            overallReviewsCounter: 1,
            avgRating: { $divide: ['$sumRating', '$overallReviewsCounter'] },
          },
        },
      ],
      as: 'ratingStatsArray',
    },
  },
  {
    $addFields: {
      ratingStats: { $arrayElemAt: ['$ratingStatsArray', 0] },
    },
  },
  {
    $project: {
      ratingStatsArray: 0,
      // avatarImage: 1,
    },
  },
];
