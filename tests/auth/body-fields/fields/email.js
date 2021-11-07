const { INVALID_EMAIL, EMAIL_REQUIRED } = require("../../../../config/errors/auth");

const email = {
  name: "email",
  tests: [
    {
      message: "should fail, invalid email",
      data: { email: "word" },
      error: INVALID_EMAIL,
    },
    {
      message: "should fail, empty string",
      data: { email: "" },
      error: EMAIL_REQUIRED,
    },
    {
      message: "should fail, no field",
      data: {},
      error: EMAIL_REQUIRED,
    },
  ],
};

module.exports = email;
