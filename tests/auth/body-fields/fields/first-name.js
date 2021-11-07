const {
  FIRST_NAME_REQUIRED,
  ALPHABATIC_FIRST_NAME,
  MIN_FIRST_NAME_LENGTH,
} = require("../../../../config/errors/auth");

const firstName = {
  name: "firstName",
  tests: [
    {
      message: "should fail, empty field",
      data: { firstName: "" },
      error: FIRST_NAME_REQUIRED,
    },
    {
      message: "should fail, no field",
      data: {},
      error: FIRST_NAME_REQUIRED,
    },
    {
      message: "should fail, in english",
      data: { firstName: "Test" },
      error: ALPHABATIC_FIRST_NAME,
    },
    {
      message: "should fail, with special characters",
      data: { firstName: "Тес*т" },
      error: ALPHABATIC_FIRST_NAME,
    },
    {
      message: "should fail, with whitespace",
      data: { firstName: "Тес т" },
      error: ALPHABATIC_FIRST_NAME,
    },
    {
      message: "should fail, with length",
      data: { firstName: "Т" },
      error: MIN_FIRST_NAME_LENGTH,
    },
  ],
};

module.exports = firstName;
