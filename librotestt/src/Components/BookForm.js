import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function BookForm() {
  const [book, setBook] = useState({ autor: '', fecha_publicacion: '', genero: '', titulo: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/books/${id}`)
        .then(response => {
          const bookData = response.data;
          const formattedDate = new Date(bookData.fecha_publicacion).toISOString().split('T')[0];
          setBook({ ...bookData, fecha_publicacion: formattedDate });
        })
        .catch(error => {
          console.error('Error fetching book:', error.response ? error.response.data : error.message);
        });
    }
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      axios.put(`http://localhost:5000/books/${id}`, book)
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error('Error updating book:', error.response ? error.response.data : error.message);
        });
    } else {
      axios.post('http://localhost:5000/books', book)
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error('Error adding book:', error.response ? error.response.data : error.message);
        });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>{id ? 'Editar Libro' : 'Agregar Libro'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="autor">Autor:</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={book.autor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fecha_publicacion">Fecha de Publicación:</label>
          <input
            type="date"
            id="fecha_publicacion"
            name="fecha_publicacion"
            value={book.fecha_publicacion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="genero">Género:</label>
          <input
            type="text"
            id="genero"
            name="genero"
            value={book.genero}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={book.titulo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{id ? 'Actualizar' : 'Agregar'}</button>
        <button type="button" onClick={handleBack} style={{ marginLeft: '10px' }}>Regresar</button>
      </form>
    </div>
  );
}

export default BookForm;
