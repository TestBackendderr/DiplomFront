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
import AdminDashboard from './components/AdminDashboard';
import AdminPanel2 from './components/AdminPanel2';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/add-product" element={
            <ProtectedRoute requireAdmin={true}>
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/korzina" element={
            <ProtectedRoute>
              <Korzina />
            </ProtectedRoute>
          } />
          <Route path="/user" element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          } />
          <Route path="/Zamowienie" element={
            <ProtectedRoute>
              <Zamowienie />
            </ProtectedRoute>
          } /> {/* Новая страница */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } /> {/* Admin Dashboard */}
          <Route path="/admin-panel2" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPanel2 />
            </ProtectedRoute>
          } /> {/* Admin Panel 2 */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
