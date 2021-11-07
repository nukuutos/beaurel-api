const Work = require('../../../models/work/work');
const asyncHandler = require('../../../middleware/async-handler');
const WorkImage = require('../../../models/work/work-image');
const { onError } = require('./utils');
const { WORKS } = require('../../../config/cache');

exports.getWorks = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const works = await Work.cache(masterId, WORKS).find({ masterId }, { masterId: 0 });

  return res.json({ works });
});

exports.addWork = asyncHandler(async (req, res) => {
  const { file, params, body } = req;

  const { buffer } = file;
  const { masterId } = params;
  const { title } = body;

  await Work.isExisted(masterId, title);

  const work = new Work(masterId, title);
  const { insertedId: _id } = await work.save();

  const image = new WorkImage(_id, buffer);
  await image.saveFS(onError);

  return res.status(201).json({ _id, message: 'Работа успешно добавлена!' });
});

exports.updateWork = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { masterId, workId } = req.params;

  const work = new Work(masterId, title);
  await work.setId(workId).checkTitle();
  await work.updateTitle();

  if (!req.file) return res.json({ message: 'Работа успешно обновлена!' });

  const { buffer } = req.file;

  const image = new WorkImage(workId, buffer);
  await image.save();

  return res.json({ message: 'Работа успешно обновлена!' });
});

exports.deleteWork = asyncHandler(async (req, res) => {
  const { workId } = req.params;

  const workImage = new WorkImage(workId);
  workImage.deleteFS();
  await Work.deleteDB(workId);

  return res.json({ message: 'Работа удалена!' });
});
