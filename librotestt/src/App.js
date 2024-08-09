// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './Components/BookList';
import BookForm from './Components/BookForm';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Gestión de Libros</h1>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/add" element={<BookForm />} />
          <Route path="/edit/:id" element={<BookForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
