const { USER_EXISTS } = require('../../../../../config/errors/auth');
const User = require('../../../../../models/user');
const { checkMasterData, checkCustomerData } = require('./check-data');
const { customerData, masterData } = require('./data-to-send');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should successfully sign up customer', async () => {
    const response = await this.request().send(customerData);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    await checkCustomerData(customerData);
  });

  it('should successfully sign up master', async () => {
    const response = await this.request().send(masterData);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    await checkMasterData(masterData);
  });

  it('should successfully sign up with unconfirmed account', async () => {
    await this.request().send(masterData);

    const response = await this.request().send(masterData);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    await checkMasterData(masterData);
  });

  it('should fail, find user with this phone', async () => {
    await this.request().send(customerData);

    await User.updateOne({}, { 'confirmation.isConfirmed': true });

    const response = await this.request().send(customerData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(USER_EXISTS);
  });
};
