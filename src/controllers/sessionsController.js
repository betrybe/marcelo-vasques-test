const Joi = require('joi');

const AuthenticateUserService = require('../services/AuthenticateUserService');
const GetErrors = require('../errors/getErrors');

class SessionsController {
  static async create(request, response) {
    const { email, password } = request.body;

    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ email, password });

    if (error) {
      throw new GetErrors('Invalid entries. Try again.', 400);
    }

    const { token } = await AuthenticateUserService.execute({ email, password });

    return response.json({ token });
  }
}

module.exports = SessionsController;