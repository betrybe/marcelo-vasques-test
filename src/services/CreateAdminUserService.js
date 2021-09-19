const User = require('../models/User');
const GetErrors = require('../errors/getErrors');

class CreateAdminUserService {
  static async execute({ name, email, password }) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new GetErrors('Email already registered', 409);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    user.password = undefined;

    return user;
  }
}

module.exports = CreateAdminUserService;