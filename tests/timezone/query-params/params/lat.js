const { LATITUDE_REQUIRED, INVALID_LATITUDE } = require("../../../../config/errors/timezone");

const lat = {
  name: "lat",
  tests: [
    {
      message: "should fail, no param",
      data: {},
      error: LATITUDE_REQUIRED,
    },
    {
      message: "should fail, empty string",
      data: { lat: "" },
      error: LATITUDE_REQUIRED,
    },
    {
      message: "should fail, invalid value",
      data: { lat: "1089n" },
      error: INVALID_LATITUDE,
    },
  ],
};

module.exports = lat;
