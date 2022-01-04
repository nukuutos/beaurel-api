/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'config', 'envs', '.env.test') });

// console.log(require('dotenv').config());

const fs = require('fs');
const User = require('../../models/user');
const master = require('../data/masters/master');
const dropDatabase = require('../utils/drop-database');
const { connectDB } = require('../../utils/database');
const Timetable = require('../../models/timetable');
const autoTimetable = require('../data/timetables/auto-timetable');
const Service = require('../../models/service');
const serviceParameter = require('../data/services/service-parameter');
const service = require('../data/services/service');
const masters = require('../data/masters/masters');
const Image = require('../../models/utils/image');
const Work = require('../../models/work');
const work = require('../data/work');
const Appointment = require('../../models/appointment');
const onConfirmationAppointment = require('../data/appointments/on-confirmation-appointment');
const confirmedAppointment = require('../data/appointments/confirmed-appointment');
const historyAppointment = require('../data/appointments/history-appointment');
const customer = require('../data/masters/customer');
const review = require('../data/review');
const Review = require('../../models/review');
const autoTimetableWithUpdate = require('../data/timetables/auto-timetable-with-update');
const unsuitableAppointment = require('../../tests/data/appointments/unsuitable-appointment');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    // db base
    'db:connect': async () => {
      await connectDB();
      return null;
    },
    'db:drop': async () => {
      await dropDatabase();
      return null;
    },
    // add data
    'db:addMaster': async () => {
      await User.save(master);
      return null;
    },
    'db:getVerificationCode': async () => {
      const data = await User.findOne({}, { _id: 0, 'confirmation.verificationCode': 1 });
      return data.confirmation.verificationCode;
    },
    'db:addCustomer': async () => {
      await User.save(customer);
      return null;
    },
    'db:addMasters': async () => {
      await User.insertMany(masters);
      return null;
    },
    'db:addTimetable': async () => {
      await Timetable.save(autoTimetable);
      return null;
    },
    'db:addTimetableWithUpdate': async () => {
      await Timetable.save(autoTimetableWithUpdate);
      return null;
    },
    'db:addService': async (title) => {
      await Service.save(service(title));
      return null;
    },
    'db:addServiceParameter': async ({ title, parameter }) => {
      await Service.save(serviceParameter(title, parameter));
      return null;
    },
    'db:addWork': async () => {
      await Work.save(work);
      return null;
    },
    'db:addOnConfirmationAppointment': async () => {
      await Appointment.save(onConfirmationAppointment);
      return null;
    },
    'db:addConfirmedAppointment': async () => {
      await Appointment.save(confirmedAppointment);
      return null;
    },
    'db:addHistoryAppointment': async () => {
      await Appointment.save(historyAppointment);
      return null;
    },
    'db:addUnsuitableAppointment': async () => {
      await Appointment.save(unsuitableAppointment);
      return null;
    },
    'db:addReview': async () => {
      await Review.save(review);
      return null;
    },
    // delete files
    'fs:deleteAvatar': async () => {
      const { avatar } = await User.findOne({ email: master.email });

      if (!avatar) throw new Error('No avatar in db!');

      const pathSavedAvatar = path.join(process.cwd(), avatar);

      let isExist = fs.existsSync(pathSavedAvatar);

      if (!isExist) throw new Error('File is not existed!');

      Image.deleteFS(pathSavedAvatar);

      isExist = fs.existsSync(pathSavedAvatar);

      if (isExist) throw new Error('File is existed after deletion!');

      return null;
    },

    'fs:deleteWork': async () => {
      const work = await Work.findOne({});

      if (!work) throw new Error('No work in db!');

      const workPath = path.join(process.cwd(), 'images', 'works', `${work._id}.png`);

      let isExist = fs.existsSync(workPath);

      if (!isExist) throw new Error('File is not existed!');

      Image.deleteFS(workPath);

      isExist = fs.existsSync(workPath);

      if (isExist) throw new Error('File is existed after deletion!');

      return null;
    },

    'fs:addWork': async () => {
      const work = await Work.findOne({});

      if (!work) throw new Error('No work in db!');

      const fixturePath = path.join(process.cwd(), 'cypress', 'fixtures', `work.png`);

      const buffer = fs.readFileSync(fixturePath);

      if (!buffer) throw new Error('No fixture!');

      const workPath = path.join(process.cwd(), 'images', 'works', `${work._id}.png`);

      fs.writeFileSync(workPath, buffer);

      const isExist = fs.existsSync(workPath);

      if (!isExist) throw new Error('File is not existed!');

      return null;
    },
  });

  return config;
};
