const HttpError = require("../../models/utils/http-error");
const Work = require("../../models/work");
const asyncHandler = require("../../middleware/async-handler");
const Image = require("../../models/utils/image/image");

exports.getWorks = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  const works = await Work.find({ masterId }, { masterId: 0 });

  return res.json({ works, type: "success" });
});

exports.addWork = asyncHandler(async (req, res, next) => {
  const {
    file: { buffer },
    params: { masterId },
    body: { title },
  } = req;

  // check title
  const isTitle = await Work.findOne({ masterId, title }, { _id: 1 });
  if (isTitle) return next(new HttpError("Work with this title is already exists", 400));

  const work = new Work(masterId, title);
  const { insertedId: _id } = await work.save();

  const image = new Image({ id: _id, buffer, subfolder: "works" });
  const onError = async () => await Work.deleteOne({ _id });
  await image.save(onError);

  return res.json({ _id, message: "Work is added successfuly!", type: "success" });
});

exports.updateWork = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const { masterId, workId } = req.params;

  // check same titles of master
  const isTitle = await Work.findOne({ _id: { $ne: workId }, masterId, title }, { _id: 1 });
  if (isTitle) return next(new HttpError("Work with this title is already exists", 400));

  await Work.updateOne({ _id: workId }, { title });

  if (!req.file) return res.json({ message: "Work is updated successfuly!", type: "success" });

  const { buffer } = req.file;

  const image = new Image({ buffer, id: workId, subfolder: "works" });
  await image.save();

  return res.json({ message: "Work is updated successfuly!", type: "success" });
});

exports.deleteWork = asyncHandler(async (req, res, next) => {
  const { workId } = req.params;

  Image.delete(workId.toString(), "works"); // 1
  await Work.deleteOne({ _id: workId }); // 2

  return res.json({ message: "Work is deleted successfuly!", type: "success" });
});
