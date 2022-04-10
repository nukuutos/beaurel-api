const app = require('../../../../app');
const User = require('../../../../models/user');
const Work = require('../../../../models/work');

const ExtendedSupertest = require('../../../extended-supertest');

const routeParams = require('./route-params/delete-work');
const controller = require('./controllers/delete-work');

const master = require('../../../data/users/master');
const works = require('./data/works');
const { after, before } = require('../../../utils/endpoint-test-preparation');
const { addImageForTest, cleanUpImage } = require('./utils');

const workId = works[0]._id.toString();

const template = `/api/v1/master/:masterId/work/:workId`;

const config = {
  template,
  routeParams: { masterId: master._id.toString(), workId },
  method: 'delete',
  user: master,
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
  await Work.insertMany(works);
  await addImageForTest(workId);
});

describe(`DELETE ${template}`, () => {
  request.testRouteParams(routeParams).testController(controller);
});

after(async () => {
  cleanUpImage(workId);
});
