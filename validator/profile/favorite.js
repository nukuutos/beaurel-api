const { paramId } = require("express-validator");
const { MASTER_ID, PROFILE_ID } = require("../../config/id-names");

const masterId = paramId("masterId", MASTER_ID);
const profileId = paramId("profileId", PROFILE_ID);

exports.addFavorite = [profileId, masterId];
exports.deleteFavorite = [profileId, masterId];
exports.getFavorites = [profileId];
