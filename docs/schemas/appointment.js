const appointment = {
  _id,
  masterId,
  customerId,
  service: "service doc",
  time: { startAt: "0-1440", endAt: "0-1440" },
  status: ["onConfirmation", "confirmed", "unsuitable", "history(ended)", "cancelled"],
  date: "date in utc",
  createdAt: "date in utc",
};

("expired => cancelled");
