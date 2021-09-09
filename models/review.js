const { REVIEW } = require("../config/collection-names");
const Collection = require("./utils/collection/collection");

class Review extends Collection {
  static name = REVIEW;

  constructor(masterId, customerId, appointmentId, value, comment) {
    super();

    this.masterId = masterId;
    this.customerId = customerId;
    this.appointmentId = appointmentId;
    this.value = value;
    this.comment = comment;
    this.reply = null;
    this.createdAt = new Date();
  }
}

module.exports = Review;
