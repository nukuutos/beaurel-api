module.exports = (masterId, title) => [
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
