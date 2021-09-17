const UserModel = require('../models/userModel');

class UserService {
  static async insert(data) {
    const insertdata = data.role ? data : { ...data, role: 'user' };
    const inserted = await UserModel.insert(insertdata);
    return { status: 201, return: inserted };
  }

  static async getAll() {
    return UserModel.findAll();
  }

  static async getById(id) {
    return UserModel.findByEmail(id);
  }

  static async getByEmail(login) {
    return UserModel.findByEmail(login);
  }
}

module.exports = UserService;