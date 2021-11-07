const Master = require('../../models/user/master/master');
const asyncHandler = require('../../middleware/async-handler');
const SearchQuery = require('../../models/user/master/search-master-query');

exports.getMasterProfile = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const profile = await Master.getMasterProfile(masterId);

  return res.json(profile);
});

exports.getMasters = asyncHandler(async (req, res) => {
  const { specialization, name, page } = req.query;

  const searchQuery = new SearchQuery(page);

  const masters = await searchQuery.addSpecialization(specialization).handleName(name).exec();

  return res.json({ masters });
});

exports.getMasterTimezone = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;

  const master = new Master(masterId);

  await master.getCity();

  const { city, timezone } = master.getTimezone();

  return res.json({ city, timezone });
});
