const Appointment = require('../../../../../../models/appointment');
const Review = require('../../../../../../models/review');
const User = require('../../../../../../models/user');
const appointments = require('./appointments-customer');
const customer = require('../../../../../data/users/customer');
const reviews = require('./reviews');

module.exports = function () {
  beforeEach(async () => {
    await Review.deleteMany({});
    await User.deleteMany({});
    await Appointment.deleteMany({});

    await User.save(customer);
    await Review.insertMany(reviews);
    await Appointment.insertMany(appointments);
  });

  it('should successfully get customer data', async () => {
    const response = await this.request().send();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { aboutText, city, appointmentsCount, reviewsCount } = body;

    expect(aboutText).toBe(customer.aboutText);
    expect(city).toBe(customer.city);
    expect(appointmentsCount).toBe(3);
    expect(reviewsCount).toBe(2);
  });
};
