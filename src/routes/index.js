const { Router } = require('express');

const usersRouter = require('./users.routes');
const loginRouter = require('./login.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/login', loginRouter);
module.exports = routes;