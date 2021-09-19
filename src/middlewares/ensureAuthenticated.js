const { verify } = require('jsonwebtoken');

const authConfig = require('../config/auth');
const GetErrors = require('../errors/getErrors');

function ensureAuthenticated(request, response, next) {
  const token = request.headers.authorization;

  if (!token) {
    throw new GetErrors('missing auth token', 401);
  }

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { id, role } = decodedToken;

    request.user = {
      id,
      role,
    };

    return next();
  } catch (err) { 
    throw new GetErrors('jwt malformed', 401);
  }
}

module.exports = ensureAuthenticated;