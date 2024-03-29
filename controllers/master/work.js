const Work = require('../../models/work');
const asyncHandler = require('../../middleware/async-handler');
const { WORKS } = require('../../config/cache');
const AddWork = require('../../logic/master/work/add-works');
const UpdateWork = require('../../logic/master/work/update-work');
const DeleteWork = require('../../logic/master/work/delete-work');

exports.getWorks = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const works = await Work.cache(masterId, WORKS).find({ masterId }, { masterId: 0 });

  return res.json({ works });
});

exports.addWork = asyncHandler(async (req, res) => {
  const { file, user, body } = req;
  const { id: masterId } = user;
  const { buffer } = file;
  const { title } = body;

  const work = new AddWork(masterId, title);

  await work.getData();
  await work.isLimit().save();
  await work.saveFile(buffer);

  return res.status(201).json({ _id: work.id, message: 'Работа успешно добавлена!' });
});

exports.updateWork = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { workId } = req.params;
  const { id: masterId } = req.user;

  const work = new UpdateWork(workId, masterId, title);
  await work.isExisted();
  await work.updateTitle();

  if (!req.file) return res.json({ message: 'Работа успешно обновлена!' });

  const { buffer } = req.file;

  await work.updateFile(buffer);

  return res.json({ message: 'Работа успешно обновлена!' });
});

exports.deleteWork = asyncHandler(async (req, res) => {
  const { workId } = req.params;
  const { id: masterId } = req.user;

  const work = new DeleteWork(workId, masterId);

  await work.delete();

  return res.json({ message: 'Работа удалена!' });
});
