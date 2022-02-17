const GetMasterTimezone = require('../../logic/master/master/get-master-timezone');
const GetMasters = require('../../logic/master/master/get-masters');
const asyncHandler = require('../../middleware/async-handler');

exports.getMasters = asyncHandler(async (req, res) => {
  const { city, specialization, name, page } = req.query;

  const searchQuery = new GetMasters(page);

  const masters = await searchQuery
    .addCity(city)
    .addSpecialization(specialization)
    .handleName(name)
    .exec();

  return res.json({ masters });
});

exports.getMasterTimezone = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;

  const master = new GetMasterTimezone(masterId);

  await master.getCity();

  const { city, timezone } = master.getTimezone();

  return res.json({ city, timezone });
});
