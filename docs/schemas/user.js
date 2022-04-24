const user = {
  _id,
  email,
  password: ['min length 6 chars'],
  firstName: ['one alphabetic word on russian'],
  lastName: ['one alphabetic word on russian'],
  avatar: null || 'path to file',
  isConfirmed: { email: [false || true], phone: [false || true] },
  role: ['master', 'user'],
  aboutText: ['length 0 to 150'],
  createdAt: 'date in utc',
};

const master = {
  _id,
  email,
  password: ['min length 6 chars'],
  firstName: ['one alphabetic word on russian'],
  lastName: ['one alphabetic word on russian'],
  avatar: null || 'path to file',
  isConfirmed: { email: [false || true], phone: [false || true] },
  placeOfWork: ['city, address'],
  role: ['master', 'user'],
  aboutText: [],
  createdAt: 'date in utc',
  specialization: ['one of specialization'],
  masters: ['array of ids'],
  city: ['city'],
};
