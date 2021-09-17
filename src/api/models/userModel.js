const collection = require('../configdb/configDbMongo');

class UserModel {
  static async insert(data) {
    try {
      const collect = await collection('users');
      const insertResult = await collect.insertOne(data);

      const user = await this.findById(insertResult.ops[0]._id);
      return { user };
    } catch (error) {
      return { message: error };
    }
  }

  static async findAll() {
    const collect = await collection('users');
    return collect.find({}).toArray();
  }

  static async findById(id) {
    const collect = await collection('users');
    const user = await collect.find({ _id: id }, { projection: { password: 0 } }).toArray();

    return user[0];
  }
}
module.exports = UserModel;
