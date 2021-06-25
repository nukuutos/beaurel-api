const { paramId } = require('../utils/id');

const masterId = paramId('masterId', 'Master Id');
const profileId = paramId('profileId', 'Profile Id');

exports.addFavorite = [profileId, masterId];
exports.deleteFavorite = [profileId, masterId];
exports.getFavorites = [profileId];
