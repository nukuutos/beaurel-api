const { INVALID_PAGE } = require("../../../../config/errors/timezone");

const page = {
  name: "page",
  tests: [
    {
      message: "should fail, no param",
      data: {},
      error: INVALID_PAGE,
    },
    {
      message: "should fail, invalid page(number)",
      data: { page: -1 },
      error: INVALID_PAGE,
    },
    {
      message: "should fail, invalid page(sting)",
      data: { page: "gjlksg" },
      error: INVALID_PAGE,
    },
  ],
};

module.exports = page;
