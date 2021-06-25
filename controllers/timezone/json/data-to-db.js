const data = require('./cities-and-tz.json');
const Timezone = require('../../../models/timezone');

module.exports = async () => await Timezone.insertMany(data);
