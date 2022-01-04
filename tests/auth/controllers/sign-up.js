const { matchersWithOptions } = require('jest-json-schema');
const { USER_EXISTS } = require('../../../config/errors/auth');
const User = require('../../../models/user');
const customerSchema = require('./schemas/customer-schema');
const masterSchema = require('./schemas/master-schema');

expect.extend(
  matchersWithOptions({
    verbose: true,
  })
);

const data = {
  phone: '+79999999999',
  password: '123456',
  confirmedPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тест',
};

module.exports = function () {
  it('should successfully sign up customer', async () => {
    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const customer = await User.findOne({});

    expect(customer).toMatchSchema(customerSchema);
    expect(customer.role).toBe('customer');

    await User.deleteMany({});
  });

  it('should successfully sign up master', async () => {
    data.specialization = 'Визажист';

    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const master = await User.findOne({});

    expect(master).toMatchSchema(masterSchema);
    expect(master.role).toBe('master');

    await User.deleteMany({});
  });

  it('should successfully sign up with unconfirmed account', async () => {
    data.specialization = 'Визажист';

    await this.request().send(data);

    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    const master = await User.findOne({});

    expect(master).toMatchSchema(masterSchema);
    expect(master.role).toBe('master');

    await User.deleteMany({});
  });

  it('should fail, find user with this phone', async () => {
    await this.request().send(data);

    await User.updateOne({}, { 'confirmation.isConfirmed': true });

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(USER_EXISTS);

    await User.deleteMany({});
  });
};
