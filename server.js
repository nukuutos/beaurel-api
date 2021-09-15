const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const { mongoConnect } = require("./utils/database");

const timezoneRoutes = require("./routes/timezone");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile/profile");
const masterRoutes = require("./routes/master/master");

const multer = require("multer");

require("./utils/array");

// const { updateTimetableJob, updateServiceJob, updateAppointmentJob } = require('./utils/scheduleJob');
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  console.log(mimetype);
  if (mimetype === "image/png" || mimetype === "image/jpg" || mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(
  multer({ storage: memoryStorage, fileFilter, limits: { fieldSize: 25 * 1024 * 1024 } }).single(
    "image"
  )
); // i think we need to place in corresponding router
app.use(cookieParser());

app.use("/", (req, res, next) => {
  console.log("--- REQUEST ---");
  console.log(req.method, req.url);
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/master", masterRoutes);
app.use("/api/v1/timezone", timezoneRoutes);

// updateTimetableJob.start();
// updateServiceJob.start();
// updateAppointmentJob.start();

app.use((error, req, res, next) => {
  // if res has already sent
  if (res.headerSent) return next(error);

  const { message, statusCode } = error;

  console.error(message, error);

  res
    .status(statusCode || 500)
    .json({ message: message || "Server error occured. Please try again.", type: "fail" });
});

mongoConnect(() => app.listen(process.env.PORT || 5000));
