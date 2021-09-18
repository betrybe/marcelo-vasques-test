const { Router } = require('express');
const UsersController = require('../controllers/createUsersController');

const usersRouter = Router();

usersRouter.post('/', UsersController.create);

module.exports = usersRouter;