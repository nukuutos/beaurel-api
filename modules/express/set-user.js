const req = require("express/lib/request");
const { ObjectId } = require("mongodb");

req.setUser = function (user) {
  const { id, ...userData } = user;

  req.user = userData;
  req.user.id = new ObjectId(id);
};
