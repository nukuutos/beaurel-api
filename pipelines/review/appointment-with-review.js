module.exports = (appointmentId, masterId, customerId, status) => [
  {
    $match: {
      _id: appointmentId,
      masterId,
      customerId,
      status: status,
    },
  },
  { $project: { _id: 1 } },
  {
    $lookup: {
      from: "reviews",
      let: {
        appointmentId: "$_id",
      },
      pipeline: [
        { $match: { $expr: { $eq: ["$appointmentId", "$$appointmentId"] } } },
        {
          $project: {
            _id: 1,
          },
        },
      ],
      as: "review",
    },
  },
  {
    $addFields: {
      review: { $first: "$review" },
    },
  },
];
