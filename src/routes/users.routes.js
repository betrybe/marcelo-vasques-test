const { Router } = require('express');
const UsersController = require('../controllers/CreateUsersController');

const usersRouter = Router();

usersRouter.post('/', UsersController.create);

module.exports = usersRouter;