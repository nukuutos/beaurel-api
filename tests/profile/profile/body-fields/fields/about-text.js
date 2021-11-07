const { INVALID_ABOUT_TEXT, ABOUT_TEXT_LENGTH } = require("../../../../../config/errors/profile");

const moreMaxLength =
  "flksdjldjl kfjsdlkjflsdjflkjdsldskkkkkkkkkkkkkkkkkkkkkfjlksdjflkjsdlfjklsdjflksdjfljsdljflsdjflkjsdlkjflkjsdlkfjlksdjflkjsdlkfjlksdjflkjsdlkjflksdjflkj";

const aboutText = {
  name: "aboutText",
  tests: [
    {
      message: "should fail, invalid field",
      data: { aboutText: "wo<>rd" },
      error: INVALID_ABOUT_TEXT,
    },
    {
      message: "should fail, invalid field",
      data: { aboutText: "wo<>rd" },
      error: INVALID_ABOUT_TEXT,
    },
    {
      message: "should fail, invalid field",
      data: { aboutText: moreMaxLength },
      error: ABOUT_TEXT_LENGTH,
    },
  ],
};

module.exports = aboutText;
