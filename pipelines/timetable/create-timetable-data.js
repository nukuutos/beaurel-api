exports.createTimetableData = (masterId) => [
  {
    $match: {
      _id: masterId,
    },
  },
  { $project: { city: 1 } },
  {
    $lookup: {
      from: 'timezones',
      let: {
        city: '$city',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$city', '$$city'],
            },
          },
        },
        {
          $project: {
            _id: 0,
            timezone: 1,
          },
        },
      ],
      as: 'timezone',
    },
  },
  { $project: { timezone: { $arrayElemAt: ['$timezone.timezone', 0] } } },
  {
    $lookup: {
      from: 'timetables',
      localField: '_id',
      foreignField: 'masterId',
      as: 'timetable',
    },
  },
  {
    $addFields: {
      timetableId: { $arrayElemAt: ['$timetable._id', 0] },
    },
  },
];
