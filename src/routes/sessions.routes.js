const { Router } = require('express');

const SessionsController = require('../controllers/sessionsController');

const sessionsRouter = Router();

sessionsRouter.post('/', SessionsController.create);

module.exports = sessionsRouter;