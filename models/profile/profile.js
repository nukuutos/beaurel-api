const getDb = require('../../utils/database').getDb;

class User {
  constructor(email, password, firstName, lastName) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photo = null;
    this.isConfirmed = { email: false, phone: false };
    this.role = 'user';
    this.createdAt = new Date();
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('users').insertOne(this);
    } catch (error) {
      throw new Error();
    }
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('users').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();

    await db.collection('users').updateOne(query, update);
  }
}

module.exports = User;
