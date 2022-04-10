const predictableFields = ({ role, username, _id }) => ({
  id: _id.toString(),
  role,
  username,
});

module.exports = { predictableFields };
