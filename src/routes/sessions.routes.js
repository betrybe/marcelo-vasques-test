const { Router } = require('express');

const SessionsController = require('../controllers/Sessionscontroller');

const sessionsRouter = Router();

sessionsRouter.post('/', SessionsController.create);

module.exports = sessionsRouter;