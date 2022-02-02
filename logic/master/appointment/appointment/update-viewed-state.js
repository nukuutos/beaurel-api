const Appointment = require('../../../../models/appointment');

class UpdateViewedState {
  static async update({ role, userId, appointmentId }) {
    const searchQuery = { _id: appointmentId };
    searchQuery[`${role}Id`] = userId;

    const updateFields = {};
    updateFields[`isViewed.${role}`] = true;

    await Appointment.updateOne(searchQuery, updateFields);
  }
}

module.exports = UpdateViewedState;
