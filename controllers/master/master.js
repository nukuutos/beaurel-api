const GetMasters = require('../../logic/master/master/get-masters');
const UpdatePlaceOfWork = require('../../logic/master/master/update-place-of-work');
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

exports.updatePlaceOfWork = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const { city, ...placeOfWork } = req.body;
  const master = new UpdatePlaceOfWork(masterId);
  await master.update(city, placeOfWork);
  return res.end();
});
