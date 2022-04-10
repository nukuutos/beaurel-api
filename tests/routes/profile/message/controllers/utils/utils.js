const getIsSorted = (data) =>
  data.every((currentMessage, index) => {
    if (index === 0) return true;

    const prevDialog = data[index - 1];
    const difference = currentMessage.createdAt.diff(prevDialog.createdAt);

    if (difference <= 0) return true;
    return false;
  });

module.exports = { getIsSorted };
