const express = require('express');
const path = require('path');
const routes = require('../routes');
require('dotenv').config();
require('../database');

const app = express();

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(routes);

module.exports = app;
