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

router.get('/users', async (request, response) => {
  response.json(await UserService.getAll(request));
});

router.get('/users/:id', async (request, response) => {
  const id = parseInt(request.params.id, 10);

  response.json(await UserService.getById(id));
});

module.exports = {
  router,
};