// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './main/Main';
import AddProduct from './components/AddProduct';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Korzina from './components/Korzina';
import UserPage from './components/UserPage';
import Zamowienie from './components/Zamowienie'; // Импортируем новую страницу
import { UserProvider } from './UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/korzina" element={<Korzina />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/Zamowienie" element={<Zamowienie />} /> {/* Новая страница */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
