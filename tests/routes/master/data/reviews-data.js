const { ObjectId } = require('mongodb/lib/bson');
const master = require('../../../data/users/master');
const master1 = require('../../../data/users/master-1');

module.exports = [
  {
    _id: new ObjectId('5f9ce8b00798650d40c6fca2'),
    masterId: master._id,
    customerId: master1._id,
    value: 2,
    comment:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident veniam, consectetur natus, illo vero deserunt nemo quo corrupti eaque cumque? Ex iste at repellat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, soluta, dicta commodi velit voluptas expedita obcaecati iusto odio vitae perspiciatis minima quo recusandae ullam modi sapiente pariatur minus repellat doloribus?',
    createdAt: new Date('2021-05-21T06:24:32.173Z'),
  },
  {
    _id: new ObjectId('5f9ce8b00798650d40c6fca1'),
    masterId: master._id,
    customerId: master1._id,
    value: 3,
    comment:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident veniam, consectetur natus, illo vero deserunt nemo quo corrupti eaque cumque? Ex iste at repellat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, soluta, dicta commodi velit voluptas expedita obcaecati iusto odio vitae perspiciatis minima quo recusandae ullam modi sapiente pariatur minus repellat doloribus?',
    createdAt: new Date('2021-05-20T06:23:32.173Z'),
  },
  {
    _id: new ObjectId('5f9ce8b00798650d40c6fca3'),
    masterId: master._id,
    customerId: master1._id,
    value: 1,
    comment:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident veniam, consectetur natus, illo vero deserunt nemo quo corrupti eaque cumque? Ex iste at repellat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, soluta, dicta commodi velit voluptas expedita obcaecati iusto odio vitae perspiciatis minima quo recusandae ullam modi sapiente pariatur minus repellat doloribus?',
    createdAt: new Date('2021-05-22T06:25:32.173Z'),
  },
  // should not found any master
  {
    _id: new ObjectId('5f9ce8b00798650d40c6fca4'),
    masterId: master1._id,
    customerId: master1._id,
    value: 4,
    comment:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident veniam, consectetur natus, illo vero deserunt nemo quo corrupti eaque cumque? Ex iste at repellat. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, soluta, dicta commodi velit voluptas expedita obcaecati iusto odio vitae perspiciatis minima quo recusandae ullam modi sapiente pariatur minus repellat doloribus?',
    createdAt: new Date('2021-05-21T06:24:32.173Z'),
  },
];
