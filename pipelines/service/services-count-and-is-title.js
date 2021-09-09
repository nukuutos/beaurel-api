module.exports = (masterId, title) => [
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
