const GetErrors = require('../errors/getErrors');

async function roleAdmin(request, response, next) {
  const { role } = request.user;

  if (role === 'admin') {
    next();
  } else {
    throw new GetErrors('Only admins can register new admins', 403);
  }      
}

module.exports = roleAdmin;