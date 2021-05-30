const HttpError = require('../../models/http-error');
const Work = require('../../models/master/work');
const { formatImageBuffer, deleteImage, saveImageFS } = require('../../utils/image');
const asyncHandler = require('../../middleware/async-handler');

exports.getWorks = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  const works = await Work.find({ masterId }, { masterId: 0 });

  return res.json({ works, type: 'success' });
});

exports.addWork = asyncHandler(async (req, res, next) => {
  const {
    file: { buffer },
    params: { masterId },
    body: { title },
  } = req;

  // check title
  const isTitle = await Work.findOne({ masterId, title }, { _id: 1 });
  if (isTitle) return next(new HttpError('Work with this title is already exists', 400));

  // create image url
  // const imageFileName = createImageName(masterId.toString());
  // const imageUrl = path.join(__dirname, '..', 'images', imageFileName);

  // work
  const work = new Work(masterId, title);

  const formatedBuffer = await formatImageBuffer(buffer);

  const _id = await work.save(formatedBuffer);

  return res.json({ _id, message: 'Work is added successfuly!', type: 'success' });
});

exports.updateWork = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const { masterId, workId } = req.params;
  const { buffer } = req.file;

  // check same titles of master
  const isTitle = await Work.findOne({ _id: { $ne: workId }, masterId, title }, { _id: 1 });
  if (isTitle) return next(new HttpError('Work with this title is already exists', 400));

  const imageUrl = 'images/works/' + workId + '.png';
  const formatedBuffer = await formatImageBuffer(buffer);

  deleteImage(imageUrl);

  await Work.updateOne({ _id: workId }, { title });
  await saveImageFS(formatedBuffer, imageUrl);

  return res.json({ message: 'Work is updated successfuly!', type: 'success' });
});

exports.deleteWork = asyncHandler(async (req, res, next) => {
  const { workId } = req.params;

  await Work.deleteOne({ _id: workId });

  const imageUrl = 'images/works/' + workId.toString() + '.png';
  deleteImage(imageUrl);

  return res.json({ message: 'Work is deleted successfuly!', type: 'success' });
});
