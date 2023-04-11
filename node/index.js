const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const dbConfig = {
  host: 'mysql-server',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

function createConnection() {
  const connection = mysql.createPool(dbConfig);

  connection.on('error', function (err) {
    throw `Falha na conexão: ${err}`
  })

  console.log('Conexão MySQL obtida com sucesso');

  return connection;
}

app.get('/', (req, res) => {
  res.send('<h1>Full Cycle Rocks!!</h1>');
})

app.listen(port, () => {
  console.log('Rodando na porta: ' + port)
})
