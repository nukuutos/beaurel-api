const asyncHandler = require('../../middleware/async-handler');
const Message = require('../../logic/profile/message');

exports.addMessage = asyncHandler(async (req, res) => {
  const { recipientId } = req.params;
  const { id: senderId } = req.user;
  const { message } = req.body;

  const messageRecord = new Message({ message, recipientId, senderId });

  await messageRecord.getData();
  await messageRecord.isRecipientExisted().setSenderData().save();

  messageRecord.sendToClient();

  return res.status(201).end();
});

exports.getDialog = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const { interlocutorId } = req.params;
  const { id: userId } = req.user;

  const dialog = await Message.getDialog({ userId, interlocutorId, page });

  return res.json({ dialog });
});

exports.setMessagesViewed = asyncHandler(async (req, res) => {
  const { interlocutorId } = req.params;
  const { id: userId } = req.user;

  Message.setMessagesViewed({ interlocutorId, userId });

  return res.end();
});
