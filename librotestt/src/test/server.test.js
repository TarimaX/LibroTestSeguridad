const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'examenlibros'
});
db.connect();

app.use(bodyParser.json());

// Configuración de las rutas
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

app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM book WHERE id = ?';
  db.query(sql, id, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length > 0) {
      const book = results[0];
      // Formatear la fecha para el formato YYYY-MM-DD
      book.fecha_publicacion = new Date(book.fecha_publicacion).toISOString().split('T')[0];
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  });
});

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

// Pruebas unitarias
describe('Book API', () => {
  beforeAll(done => {
    db.query('CREATE TABLE IF NOT EXISTS book (id INT AUTO_INCREMENT PRIMARY KEY, autor VARCHAR(255), fecha_publicacion DATE, genero VARCHAR(255), titulo VARCHAR(255))', done);
  });

  afterAll(done => {
    db.query('DROP TABLE book', (err) => {
      if (err) {
        done(err);
      } else {
        db.end(done); // Cierra la conexión a la base de datos después de las pruebas
      }
    });
  });

  it('should fetch all books', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new book', async () => {
    const newBook = { autor: 'Homero', fecha_publicacion: '2024-07-26', genero: 'Poema Epico', titulo: 'La odisea' };
    const response = await request(app).post('/books').send(newBook);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(newBook);
  });

  it('should fetch a book by ID', async () => {
    const newBook = { autor: 'Homero', fecha_publicacion: '2024-07-26', genero: 'Poema Epico', titulo: 'La odisea' };
    const createResponse = await request(app).post('/books').send(newBook);
    const bookId = createResponse.body.id;
    const response = await request(app).get(`/books/${bookId}`);
    expect(response.status).toBe(200);
    
    // Formatear la fecha de la respuesta para coincidir con el formato esperado
    const fetchedBook = response.body;
    fetchedBook.fecha_publicacion = fetchedBook.fecha_publicacion.split('T')[0]; // Formatear la fecha

    expect(fetchedBook).toMatchObject(newBook);
  });

  it('should delete a book by ID', async () => {
    const newBook = { autor: 'Homero', fecha_publicacion: '2024-07-26', genero: 'Poema Epico', titulo: 'La odisea' };
    const createResponse = await request(app).post('/books').send(newBook);
    const bookId = createResponse.body.id;
    const deleteResponse = await request(app).delete(`/books/${bookId}`);
    expect(deleteResponse.status).toBe(200);
    const fetchResponse = await request(app).get(`/books/${bookId}`);
    expect(fetchResponse.status).toBe(404);
  });
});
