import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error al obtener los libros:', error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <Link to="/add">Agregar Libro</Link>
      <h2>Lista de Libros</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Autor</th>
            <th>Fecha de Publicación</th>
            <th>Género</th>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.autor}</td>
              <td>{formatDate(book.fecha_publicacion)}</td>
              <td>{book.genero}</td>
              <td>{book.titulo}</td>
              <td>
                <Link to={`/edit/${book.id}`}>Editar</Link>
                <button onClick={() => deleteBook(book.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
