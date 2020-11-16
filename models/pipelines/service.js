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
      subServices: {
        $push: {
          id: '$_id',
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

// exports.serviceByMasterIdPipeline = (masterId) => [
//   {
//     $match: {
//       masterId,
//     },
//   },
//   {
//     $facet: {
//       services: [
//         {
//           // this stage for services like
//           // hair cut for 10sm
//           //              20sm
//           //              ....
//           $group: {
//             _id: '$title',
//             title: { $first: '$title' },
//             subServices: {
//               $push: {
//                 id: '$_id',
//                 parameter: '$parameter',
//                 duration: '$duration',
//                 price: '$price',
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//           },
//         },
//       ],
//       // get timetable with help of one service document
//       timetable: [
//         { $limit: 1 },
//         {
//           $lookup: {
//             from: 'timetables',
//             localField: 'masterId',
//             foreignField: 'masterId',
//             as: 'timetable',
//           },
//         },
//         {
//           $addFields: {
//             timetable: { $arrayElemAt: ['$timetable', 0] },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             sessionTime: '$timetable.sessionTime',
//             update: '$timetable.update',
//           },
//         },
//       ],
//     },
//   },
//   {
//     $addFields: {
//       timetable: { $arrayElemAt: ['$timetable', 0] },
//     },
//   },

// {
//   // this stage for services like
//   // hair cut for 10sm
//   //              20sm
//   //              ....
//   $group: {
//     _id: '$title',
//     title: { $first: '$title' },
//     subServices: {
//       $push: {
//         id: '$_id',
//         parameter: '$parameter',
//         duration: '$duration',
//         price: '$price',
//       },
//     },
//   },
// },
// {
//   $project: {
//     _id: 0,
//   },
// },
// ];
