const work = {
  _id,
  masterId,
  title: ['/^[а-я -,.!?()0-9]+$/i', 'Length({ min: 3, max: 50 })'],
};
