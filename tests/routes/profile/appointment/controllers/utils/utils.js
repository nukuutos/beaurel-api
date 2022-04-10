const getIsViewedCustomer = (appointments) =>
  appointments.every(({ isViewed }) => {
    const { master, customer } = isViewed;
    if (!master && customer) return true;
    return false;
  });

const getIsViewedMaster = (appointments) =>
  appointments.every(({ isViewed }) => {
    const { master, customer } = isViewed;
    if (master && !customer) return true;
    return false;
  });

const getIsSorted = (appointments) =>
  appointments.every((currentDate, index) => {
    if (index === 0) return true;

    const prevDate = appointments[index - 1];
    const difference = currentDate.diff(prevDate);

    if (difference < 0) return true;
    return false;
  });

module.exports = { getIsSorted, getIsViewedMaster, getIsViewedCustomer };
