const UserModel = require('../models/userModel');

class UserService {
  static async insert(data) {
    const insertdata = data.role ? data : { ...data, role: 'user' };
    const inserted = await UserModel.insert(insertdata);
    return { status: 201, return: inserted };
  }
}

module.exports = UserService;