exports.serviceAndTimetablePipeline = (serviceId, masterId) => [
  { $match: { _id: serviceId, masterId } },
  {
    $project: {
      masterId: 1,
      currentService: {
        title: '$title',
        parameter: '$parameter',
        duration: '$duration',
        price: '$price',
      },
    },
  },
  {
    $lookup: {
      from: 'timetables',
      localField: 'masterId',
      foreignField: 'masterId',
      as: 'timetable',
    },
  },
  {
    $addFields: {
      timetable: { $arrayElemAt: ['$timetable', 0] },
    },
  },
  {
    $project: {
      currentService: 1,
      timetable: {
        sessionTime: 1,
        update: 1,
      },
    },
  },
];

exports.serviceByMasterIdPipeline = (masterId) => [
  {
    $match: {
      masterId,
    },
  },
  {
    // this stage for services like
    // hair cut for 10sm
    //              20sm
    //              ....
    $group: {
      _id: '$title',
      title: { $first: '$title' },
      parameters: {
        $push: {
          parameter: '$parameter',
          duration: '$duration',
          price: '$price',
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
    },
  },
];
