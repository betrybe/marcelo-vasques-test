const express = require('express');

const router = express.Router();

const UserService = require('../services/userService');

router.post('/users', async (request, response) => {
  const user = request.body;

  if (!user.name || !user.email || !user.password) {
    return response.status(400).json({ message: 'Invalid entries. Try again.' });
  }

  const userService = await UserService.insert(user);

  return response.status(userService.status).send(userService.return);
});

module.exports = {
  router,
};