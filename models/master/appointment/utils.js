exports.toConfirmed = (masterId, date, batch) => {
  batch.find({ masterId, date: { $gte: date } }).update({ $set: { status: 'confirmed' } });
};

exports.toUnsuitableBySessionTime = (masterId, date, sessionTime, batch) => {
  batch
    .find({
      masterId,
      date: { $gte: date },
      'service.duration': { $not: { $mod: [sessionTime, 0] } },
    })
    .update({ $set: { status: 'unsuitable' } });
};

exports.toUnsuitableByPossibleTime = (masterId, date, possibleTimes, sessionTime, batch) => {
  possibleTimes = [...possibleTimes, possibleTimes[possibleTimes.length - 1] + sessionTime];

  batch
    .find({
      masterId,
      date: { $gte: date },
      $or: [{ 'time.startAt': { $nin: possibleTimes } }, { 'time.endAt': { $nin: possibleTimes } }],
    })
    .update({ $set: { status: 'unsuitable' } });
};

exports.toUnsuitableByWeekends = (masterId, date, weekends, batch) => {
  batch.find({ masterId, date: { $gte: date } }).update([
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: date },
      },
    },
    {
      $set: {
        status: {
          $cond: {
            if: { $in: ['$dayOfWeek', weekends.map((day) => day + 1)] },
            then: 'unsuitable',
            else: '$status',
          },
        },
      },
    },
    {
      $project: {
        dayOfWeek: 0,
      },
    },
  ]);
};
