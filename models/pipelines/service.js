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

exports.servicesAndTimetablePipeline = (masterId) => [
  { $match: { masterId } },
  {
    $project: {
      masterId: 1,
      timetable: {
        sessionTime: '$sessionTime',
        update: '$update',
      },
    },
  },
  {
    $lookup: {
      from: 'services',
      let: {
        masterId,
      },
      pipeline: [
        { $match: { $expr: { $eq: ['$masterId', '$$masterId'] } } },
        {
          $facet: {
            // get services with params
            servicesParameter: [
              {
                $match: {
                  $expr: { $ne: ['$parameter', null] },
                },
              },
              {
                $group: {
                  _id: '$title',
                  title: { $first: '$title' },
                  order: { $first: '$order' },
                  subServices: {
                    $push: {
                      id: '$_id',
                      parameter: '$parameter',
                      duration: '$duration',
                      price: '$price',
                      subOrder: '$subOrder',
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            // services without params
            services: [
              {
                $match: {
                  $expr: { $eq: ['$parameter', null] },
                },
              },
              {
                $addFields: {
                  id: '$_id',
                },
              },
              {
                $project: {
                  _id: 0,
                  masterId: 0,
                  parameter: 0,
                },
              },
            ],
          },
        },
        // concat seriveces with params and without
        {
          $project: { servicesArray: { $concatArrays: ['$servicesParameter', '$services'] } },
        },
      ],
      as: 'services',
    },
  },
  {
    $project: {
      _id: 0,
      timetable: 1,
      services: { $arrayElemAt: ['$services.servicesArray', 0] },
    },
  },
];

exports.servicesCountAndIsTitleExists = (masterId, title) => [
  { $match: { masterId } },
  //
  {
    $facet: {
      // get services count with params
      servicesCount: [
        {
          $group: {
            _id: '$title',
          },
        },
        { $count: 'servicesCount' },
      ],
      // servicesParameter: [
      //   {
      //     $match: {
      //       $expr: { $ne: ['$parameter', null] },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: '$title',
      //       title: { $first: '$title' },
      //       subServicesCount: { $sum: 1 },
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //     },
      //   },
      // ],
      isTitle: [{ $match: { title } }, { $project: { _id: 1 } }],
    },
  },
  {
    $project: {
      servicesCount: { $arrayElemAt: ['$servicesCount.servicesCount', 0] }, // break nesting with this trick
      isTitle: { $arrayElemAt: ['$isTitle._id', 0] },
      // servicesParameter: 1,
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

// add sub Service
exports.serviceParameterPipeline = (masterId, title) => [
  {
    $match: {
      masterId,
      title,
    },
  },
  {
    $group: {
      _id: null,
      order: { $first: '$order' },
      subServices: {
        $push: {
          parameter: '$parameter',
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      // order: { $arrayElemAt: ['$servicesCount.servicesCount', 0] },
      // subServicesCount: { $arrayElemAt: ['$servicesCount.servicesCount', 0] },
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
