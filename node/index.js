const express = require('express');
const mysql = require('mysql');
const { uniqueNamesGenerator, names, starWars } = require('unique-names-generator');
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

function createUniqueName() {
  const generatorConfig = {
    dictionaries: [names, starWars]
  };
  return uniqueNamesGenerator(generatorConfig);
}

function getPeople() {
  const connection = createConnection();

  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM people`, (error, result) => {
      if (error) {
        console.log(`Erro. Retorno do resolve getPeople(): ${error}`);
        return reject(error);
      }
      console.log(`Sucesso. Retorno dentro do resolve getPeople(): ${result}`);
      return resolve(result);
    });
  })
}

function insertPeople() {
  const connection = createConnection();
  const name = createUniqueName();
  const sql = `INSERT INTO people(name) values('${name}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(`Erro. Retorno do resolve insertPeople(): ${error}`);
        return reject(error);
      }
      console.log(`Sucesso. Retorno do resolve insertPeople(): ${result}`);
      return resolve(result);
    })
  })
}

app.get('/', (req, res) => {
  insertPeople().then(() => {
    getPeople().then((people) => {
      let content = '<h1>Full Cycle Rocks!!</h1>'
      content += '<table>'
      content += '<h4>Lista de nomes cadastrada no banco de dados:</h4>'
      for (const person of people) {
        content += `<tr><td>${person.id}. ${person.name}</td></tr>`
      }
      content += '</table>'
      res.send(content);
      console.log(`Dados do banco: ${people}`)
    });
  });
})

app.listen(port, () => {
  console.log('Rodando na porta: ' + port)
})
