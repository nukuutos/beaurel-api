const unnecessaryStatuses = ['unsuitable', 'rejected', 'history'];

// day of week !!!!

exports.toConfirmed = (masterId, date, batch) => {
  batch.find({ masterId, date: { $gte: date } }).update({ $set: { status: 'confirmed' } });
};

exports.toUnsuitableBySessionTime = (masterId, date, sessionTime, batch) => {
  batch
    .find({
      masterId,
      date: { $gte: date },
      status: { $nin: unnecessaryStatuses },
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
      status: { $nin: unnecessaryStatuses },
      $or: [{ 'time.startAt': { $nin: possibleTimes } }, { 'time.endAt': { $nin: possibleTimes } }],
    })
    .update({ $set: { status: 'unsuitable' } });
};

exports.toUnsuitableByWeekends = (masterId, date, weekends, batch) => {
  batch.find({ masterId, date: { $gte: date }, status: { $nin: unnecessaryStatuses } }).update([
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: '$date' },
      },
    },
    {
      $set: {
        status: {
          $cond: {
            if: { $in: ['$dayOfWeek', weekends.map((day) => day + 1)] }, // "+ 1" are u sure?
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

// exceptions test it
exports.toUnsuitableByExceptions = (masterId, date, exceptions, batch) => {
  batch.find({ masterId, date: { $gte: date }, status: { $nin: unnecessaryStatuses } }).update([
    {
      $addFields: {
        dayOfWeek: { $subtract: [{ $dayOfWeek: '$date' }, 1] },
        exceptions: { $objectToArray: exceptions },
      },
    },
    {
      $addFields: {
        day: { $arrayElemAt: ['$exceptions', '$dayOfWeek'] },
      },
    },
    {
      $set: {
        status: {
          $cond: {
            if: { $in: ['$time.startAt', '$day.v'] },
            then: 'unsuitable',
            else: '$status',
          },
        },
      },
    },
    {
      $project: {
        dayOfWeek: 0,
        exceptions: 0,
        day: 0,
      },
    },
  ]);
};

// appointments test it
// batch ?
exports.toUnsuitableByAppointments = (masterId, date, appointments, batch) => {
  batch.find({ masterId, date: { $gte: date }, status: { $nin: unnecessaryStatuses } }).update([
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: '$date' },
        appointments: { $objectToArray: appointments },
      },
    },
    {
      $addFields: {
        day: { $arrayElemAt: ['$appointments', '$dayOfWeek'] },
      },
    },
    {
      $set: {
        status: {
          $cond: {
            if: { $not: { $in: ['$time.startAt', '$day.v'] } },
            then: 'unsuitable',
            else: '$status',
          },
        },
      },
    },
    {
      $project: {
        dayOfWeek: 0,
        appointments: 0,
        day: 0,
      },
    },
  ]);
};
