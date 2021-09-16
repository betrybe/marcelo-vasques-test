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
}
module.exports = UserModel;
