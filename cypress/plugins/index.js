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
const axios = require('axios');
const sharp = require('sharp');
const User = require('../../models/user');
const master = require('../data/masters/master');
const dropDatabase = require('../utils/drop-database');
const { connectDB, closeDB } = require('../../utils/database/database');
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
const onConfirmationAppointmentCustomer = require('../data/appointments/on-confirmation-appointment-customer');
const onConfirmationAppointmentMaster = require('../data/appointments/on-confirmation-appointment-master');
const confirmedAppointmentCustomer = require('../data/appointments/confirmed-appointment-customer');
const confirmedAppointmentMaster = require('../data/appointments/confirmed-appointment-master');
const historyAppointment = require('../data/appointments/history-appointment');
const customer = require('../data/masters/customer');
const review = require('../data/reviews/review');
const Review = require('../../models/review');
const autoTimetableWithUpdate = require('../data/timetables/auto-timetable-with-update');
const unsuitableAppointmentMaster = require('../data/appointments/unsuitable-appointment-master');
const unsuitableAppointmentCustomer = require('../data/appointments/unsuitable-appointment-customer');
const Message = require('../../models/message');
const dialogsLastMessages = require('../data/messages/dialogs-last-messages');
const dialog = require('../data/messages/dialog');
const appointmentsOnScroll = require('../data/appointments/appointments-on-scroll');
const masterBeginner = require('../data/masters/master-beginner');
const masterWithFavorites = require('../data/masters/master-with-favorites');
const dialogsOnScroll = require('../data/messages/dialogs-on-scroll');
const bookedAppointments = require('../data/appointments/booked-appointments');
const { dropRedis, connectRedis, closeRedis } = require('../../utils/redis');
const addDataForBookWithUnsuitableService = require('../data/tests/book-timetable/book-with-unsuitable-service');
const addDataForBookWithExpiredUnsuitableService = require('../data/tests/book-timetable/book-with-expired-unsuitable-service');
const addDataForBookWithUpdatedService = require('../data/tests/book-timetable/book-with-updated-service');
const appointmentsToUnsuitable = require('../data/tests/appointments/appointments-to-unsuitable-socket');
const bookAppointmentSocket = require('../data/tests/appointments/book-appointment-socket');
const cancelledConfirmedAppointmentAsCustomer = require('../data/tests/appointments/cancelled-confirmed-appointment-as-customer');
const cancelledConfirmedAppointmentAsMaster = require('../data/tests/appointments/cancelled-confirmed-appointment-as-master');
const addMasterWithoutServices = require('../data/tests/navigation/master-without-services');
const unreadMessageForMaster = require('../data/messages/unread-message-for-master');
const unreadMessageForCustomer = require('../data/messages/unread-message-for-customer');
const cleanUpBucket = require('../../tests/utils/clean-up-bucket');
const s3 = require('../../utils/s3');
const reviewsOnScroll = require('../data/reviews/reviews-on-scroll');
const addDataForUpdateUnsuitableAppointmentBeforeUpdate = require('../data/tests/appointments/update-unsuitable-appointment-before-update');

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
    'db:close': async () => {
      await closeDB();
      return null;
    },
    'redis:connect': async () => {
      await connectRedis();
      return null;
    },
    'redis:close': async () => {
      await closeRedis();
      return null;
    },
    'db:drop': async () => {
      await dropDatabase();
      return null;
    },
    'redis:drop': () => {
      dropRedis();
      return null;
    },
    // add data
    'db:addMaster': async () => {
      await User.save(master);
      return null;
    },
    'db:addReviewsOnScroll': async () => {
      await Review.insertMany(reviewsOnScroll);
      return null;
    },
    'db:addUnreadMessageForMaster': async () => {
      await Message.save(unreadMessageForMaster);
      return null;
    },
    'db:addUnreadMessageForCustomer': async () => {
      await Message.save(unreadMessageForCustomer);
      return null;
    },
    'db:addDataForBookWithUnsuitableService': addDataForBookWithUnsuitableService,
    'db:addDataForBookWithExpiredUnsuitableService': addDataForBookWithExpiredUnsuitableService,
    'db:addDataForBookWithUpdatedService': addDataForBookWithUpdatedService,
    'db:appointmentsToUnsuitable': appointmentsToUnsuitable,
    'db:bookAppointmentSocket': bookAppointmentSocket,
    'db:cancelledConfirmedAppointmentAsCustomer': cancelledConfirmedAppointmentAsCustomer,
    'db:cancelledConfirmedAppointmentAsMaster': cancelledConfirmedAppointmentAsMaster,
    'db:addMasterWithoutServices': addMasterWithoutServices,
    'db:updateUnsuitableAppointmentBeforeUpdate': addDataForUpdateUnsuitableAppointmentBeforeUpdate,

    'db:addBookedAppointments': async () => {
      await Appointment.insertMany(bookedAppointments);
      return null;
    },
    'db:addDialogsOnScroll': async () => {
      await Message.insertMany(dialogsOnScroll);
      return null;
    },
    'db:addMasterWithFavorites': async () => {
      await User.save(masterWithFavorites);
      return null;
    },
    'db:addMasterBeginner': async () => {
      await User.save(masterBeginner);
      return null;
    },
    'db:getVerificationCode': async () => {
      const data = await User.findOne({}, { _id: 0, 'confirmation.verificationCode': 1 });
      return data.confirmation.verificationCode;
    },
    'db:getResetPasswordVerificationCode': async () => {
      const data = await User.findOne({}, { _id: 0, 'resetPassword.verificationCode': 1 });
      return data.resetPassword.verificationCode;
    },
    'db:getViewedMessages': async () => {
      const data = await Message.find({ isUnread: false });
      return data.length;
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
    'db:addDialogsLastMessages': async () => {
      await Message.insertMany(dialogsLastMessages);
      return null;
    },
    'db:addDialog': async () => {
      await Message.insertMany(dialog);
      return null;
    },
    'db:addOnConfirmationAppointmentCustomer': async () => {
      await Appointment.save(onConfirmationAppointmentCustomer);
      return null;
    },
    'db:addOnConfirmationAppointmentMaster': async () => {
      await Appointment.save(onConfirmationAppointmentMaster);
      return null;
    },
    'db:addAppointmentsOnScroll': async () => {
      await Appointment.insertMany(appointmentsOnScroll);
      return null;
    },
    'db:addConfirmedAppointmentMaster': async () => {
      await Appointment.save(confirmedAppointmentMaster);
      return null;
    },
    'db:addConfirmedAppointmentCustomer': async () => {
      await Appointment.save(confirmedAppointmentCustomer);
      return null;
    },
    'db:addHistoryAppointment': async () => {
      await Appointment.save(historyAppointment);
      return null;
    },
    'db:addUnsuitableAppointmentMaster': async () => {
      await Appointment.save(unsuitableAppointmentMaster);
      return null;
    },
    'db:addUnsuitableAppointmentCustomer': async () => {
      await Appointment.save(unsuitableAppointmentCustomer);
      return null;
    },
    'db:addReview': async () => {
      await Review.save(review);
      return null;
    },
    'request:bookAppointment': async ({ user, appointment }) => {
      const data = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/v1/auth/sign-in',
        data: user,
      });

      await axios({
        method: 'post',
        url: `http://localhost:5000/api/v1/master/${master._id}/appointment`,
        data: appointment,
        headers: {
          Authorization: `Bearer ${data.data.accessToken}`,
        },
      });

      return null;
    },

    // delete files
    'fs:deleteAvatar': async () => {
      await cleanUpBucket();

      return null;
    },

    'fs:deleteWork': async () => {
      await cleanUpBucket();
      return null;
    },

    'fs:addWork': async () => {
      const work = await Work.findOne({});

      if (!work) throw new Error('No work in db!');

      const fixturePath = path.join(process.cwd(), 'cypress', 'fixtures', `work.png`);

      const buffer = fs.readFileSync(fixturePath);

      // const formattedBuffer = await sharp.decreaseSize(buffer);

      await s3.Upload({ buffer, name: `${work._id}.png` }, master._id.toString());

      return null;
    },
  });

  return config;
};
