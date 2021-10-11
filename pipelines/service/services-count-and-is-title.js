module.exports = (masterId, title) => [
  { $match: { masterId } },
  //
  {
    $facet: {
      // get services count with params
      count: [
        {
          $group: {
            _id: "$title",
          },
        },
        { $count: "count" },
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
      count: { $arrayElemAt: ["$count.count", 0] }, // break nesting with this trick
      isTitle: { $arrayElemAt: ["$isTitle._id", 0] },
      // servicesParameter: 1,
    },
  },
];
