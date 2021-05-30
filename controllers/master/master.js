const Master = require('../../models/master/master/master');
const asyncHandler = require('../../middleware/async-handler');

exports.getMasterProfile = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  const profile = await Master.getMasterProfile(masterId);
  return res.status(200).json(profile);
});

exports.getMasters = asyncHandler(async (req, res, next) => {
  const { specialization, name, page } = req.query;

  // search by query
  const query = { role: 'master' };

  if (specialization.length) query.specialization = new RegExp(`^${specialization}`, 'i');

  // search by name (add id)
  if (name.includes(' ')) {
    const [firstName, lastName] = name.split(' ').map((name) => new RegExp(`^${name}`, 'i'));
    query.$or = [
      { firstName, lastName },
      { firstName: lastName, lastName: firstName },
    ];
  } else if (name.length) {
    const regexName = new RegExp(`^${name}`, 'i');
    query.$or = [{ firstName: regexName }, { lastName: regexName }];
  }

  const data = await Master.findMasters(query, page);

  console.log(query, data);

  return res.status(200).json({ masters: data || [] });
});