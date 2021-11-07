const { invalidParam } = require('../../config/errors/id');
const { PROFILE_ID } = require('../../config/id-names');

const profileId = {
  name: 'profileId',
  tests: [
    {
      message: 'should fail, invalid profile id',
      data: { profileId: '12312abc' },
      error: invalidParam(PROFILE_ID),
    },
    {
      message: 'should fail, invalid profile id',
      data: { profileId: 'null' },
      error: invalidParam(PROFILE_ID),
    },
  ],
};

module.exports = profileId;
