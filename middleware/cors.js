const cors = require("cors");

const { CLIENT_URL } = process.env;

module.exports = cors({ origin: CLIENT_URL, credentials: true });
