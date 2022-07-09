const getIsSorted = (reviews) =>
  reviews.every((currentDate, index) => {
    if (index === 0) return true;

    const prevDate = reviews[index - 1];
    const difference = currentDate.diff(prevDate);

    if (difference < 0) return true;
    return false;
  });

module.exports = { getIsSorted };
