const {
  PASSWORD_REQUIRED,
  MIN_PASSWORD_LENGTH,
  PASSWORDS_DISMATCHED,
} = require("../../../../config/errors/auth");

const passwordSignUp = {
  name: "password",
  tests: [
    {
      message: "should fail, empty password",
      data: { password: "" },
      error: PASSWORD_REQUIRED,
    },
    {
      message: "should fail, no field",
      data: {},
      error: PASSWORD_REQUIRED,
    },
    {
      message: "should fail, min length",
      data: { password: "1234" },
      error: MIN_PASSWORD_LENGTH,
    },
    {
      message: "should fail, dismatched with password-confirmation",
      data: { password: "1234567" },
      error: PASSWORDS_DISMATCHED,
    },
  ],
};

module.exports = passwordSignUp;
