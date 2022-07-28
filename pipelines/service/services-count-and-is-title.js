module.exports = (masterId, title) => [
  { $match: { masterId } },
  {
    $facet: {
      // get services count with params
      count: [
        {
          $group: {
            _id: '$title',
          },
        },
        { $count: 'count' },
      ],
      isTitle: [{ $match: { title } }, { $project: { _id: 1 } }],
    },
  },
  {
    $project: {
      count: { $arrayElemAt: ['$count.count', 0] },
      isTitle: { $arrayElemAt: ['$isTitle._id', 0] },
    },
  },
];
