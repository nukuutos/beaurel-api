const UpdateService = require('../../logic/master/service/update-service');
const Service = require('../../models/service');
const cronServices = require('../data/services/cron-services');
const { before, after } = require('../utils/endpoint-test-preparation');

describe(`Cron update services`, () => {
  before();

  it('should successfully update service', async () => {
    await Service.insertMany(cronServices);

    await UpdateService.update();

    const services = await Service.find({ update: null });

    expect(services).toHaveLength(1);
    expect(services[0].duration).toBe(90);
  });

  after();
});
