const { PASSWORD_REQUIRED } = require("../../../../config/errors/auth");

const passwordSignIn = {
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
  ],
};

module.exports = passwordSignIn;
