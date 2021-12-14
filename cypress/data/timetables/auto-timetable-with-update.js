const { ObjectId } = require('mongodb');
const master = require('../masters/master');

module.exports = {
  _id: new ObjectId('5f1e9682bc7d1919843a5879'),
  masterId: master._id,
  sessionTime: 120,
  type: 'auto',
  auto: {
    workingDay: { startAt: 480, endAt: 1080 },
    weekends: [6],
    possibleAppointmentsTime: [480, 600, 720, 840, 960],
    exceptions: { 0: [], 1: [], 2: [], 3: [600, 720], 4: [], 5: [], 6: [] },
  },
  manually: {
    appointments: {
      0: [],
      1: [600],
      2: [720],
      3: [],
      4: [720, 840],
      5: [600, 720, 960, 1080],
      6: [],
    },
  },
  timezone: 'Asia/Vladivostok',
  update: {
    sessionTime: 90,
    type: 'auto',
    auto: {
      workingDay: { startAt: 480, endAt: 1080 },
      weekends: [6],
      possibleAppointmentsTime: [480, 570, 660, 750, 840, 930],
      exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
    },
    manually: {
      appointments: {
        0: [],
        1: [600],
        2: [720],
        3: [],
        4: [720, 840],
        5: [600, 720, 960, 1080],
        6: [],
      },
    },
    date: new Date('2021-09-28T14:00:00.49Z'),
  },
};
