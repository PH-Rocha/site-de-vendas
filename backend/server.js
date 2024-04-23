const express = require('express');
const app = express();
const db = require('./config/db.config');

var bodyParser = require('body-parser');
let router = require('./routes/Router');

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('resources'));
app.use('/', router);

const server = app.listen(8080, function () {

  let host = server.address().address
  let port = server.address().port

  console.log("App está rodando no endereço http://%s:%s", host, post);
});

db.sequelize.sync({ force: true })
  .then(() => {
    console.log('modelos sincronizados com o banco de dados.');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar modelos com o banco de dados');
  });