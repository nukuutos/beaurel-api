const services = require('./services');
const moscowMaster = require('./moscow-master');

const moscowServices = services.map((service) => ({
  ...service,
  masterId: moscowMaster._id,
}));

module.exports = moscowServices;
