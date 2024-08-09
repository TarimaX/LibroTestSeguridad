const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'password',
  database: 'examenlibros'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener todos los libros
app.get('/books', (req, res) => {
  const sql = 'SELECT * FROM book';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Ruta para crear un nuevo libro
app.post('/books', (req, res) => {
  const newBook = req.body;
  const sql = 'INSERT INTO book SET ?';
  db.query(sql, newBook, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ id: result.insertId, ...newBook });
  });
});

// Ruta para obtener un libro por ID
app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM book WHERE id = ?';
    db.query(sql, id, (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send('Book not found');
      }
    });
  });
  

// Ruta para eliminar un libro
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM book WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(result);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
