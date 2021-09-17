const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

router.post('/login', async (request, response, _next) => {
  if (!request.body.email || !request.body.password) {
    return response.status(401).json({ message: 'All fields must be filled' });
  }

  const user = await userService.getByEmail(request.body.email);

  if (!user || request.body.password !== user.password) {
    return response.status(401).json({ message: 'Incorrect username or password' });
  }

  const { _id, name, role } = user;

  const token = 'Bearer '.concat(
    jwt.sign({ _id, name, role }, 'mysecret', {
      expiresIn: 60 * 60 * 8,
    }),
  );
  return response.status(200).json({ token });
});

module.exports = {
  router,
};