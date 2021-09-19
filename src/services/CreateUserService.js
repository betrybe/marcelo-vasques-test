const User = require('../models/User');
const GetErrors = require('../errors/getErrors');

class CreateUserService {
  static async execute({ name, email, password }) {
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      throw new GetErrors('Email already registered', 409);
    }
  
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    user.password = undefined;

    return user;
  }
}

module.exports = CreateUserService;