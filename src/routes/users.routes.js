const { Router } = require('express');
const UsersController = require('../controllers/CreateUsersController');
const UsersAdminController = require('../controllers/UsersAdminController.js');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const roleAdmin = require('../middlewares/roleAdmin');

const usersRouter = Router();

usersRouter.post('/', UsersController.create);
usersRouter.post('/admin', ensureAuthenticated, roleAdmin, UsersAdminController.create);

module.exports = usersRouter;