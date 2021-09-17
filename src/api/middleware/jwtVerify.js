const jwt = require('jsonwebtoken');

module.exports = async function verifyJWT(request, response, _next) {
  const token = request.headers.authorization;
  if (!token) return response.status(401).json({ message: 'missing auth token' });

  jwt.verify(token.split(' ')[1], 'mysecret', async (err, decoded) => {
    const message = 'jwt malformed';
    if (err) return response.status(401).json({ message });

    request.decoded = decoded;

    _next();
  });
};