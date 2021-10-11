const service = {
  _id,
  masterId,
  title: ["length 3 - 50", "/^[а-я -,.!?()0-9]+$/i"],
  duration: ["int 1 - 1440", "% 90"],
  price: ["int 0 - 99999"],
  order: ["int"],
  subOrder: null || ["int min 0"],
  parameter: null || ["length 2 - 10", "/^[а-я -,.!?()0-9]+$/i"],
  update: null || { duration: ["int 1 - 1440"], status: "unsuitable" || "suitable", date },
};
