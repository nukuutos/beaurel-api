module.exports = (masterId) => [
  { $match: { masterId, 'update.status': 'unsuitable' } },
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
            update: 0,
            subOrder: 0,
          },
        },
      ],
    },
  },
  // concat seriveces with params and without
  {
    // $project: { services: { $arrayElemAt: [{ $concatArrays: ['$servicesParameter', '$services'] }, 0] } },
    $project: { services: { $concatArrays: ['$servicesParameter', '$services'] } },
  },
];
