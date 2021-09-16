const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/', require('./controllers/CreateUserController').router);

module.exports = app;
