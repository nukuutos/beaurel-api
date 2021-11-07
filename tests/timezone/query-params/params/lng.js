const { LONGITUDE_REQUIRED, INVALID_LONGITUDE } = require("../../../../config/errors/timezone");

const lng = {
  name: "lng",
  tests: [
    {
      message: "should fail, no param",
      data: {},
      error: LONGITUDE_REQUIRED,
    },
    {
      message: "should fail, empty string",
      data: { lng: "" },
      error: LONGITUDE_REQUIRED,
    },
    {
      message: "should fail, invalid value",
      data: { lng: "1089n" },
      error: INVALID_LONGITUDE,
    },
  ],
};

module.exports = lng;
