import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import '../styles/adminDashboard.scss';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState({ show: false, message: "", onConfirm: null });

  useEffect(() => {
    fetchAllUsers();
    fetchStats();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('http://localhost:5000/api/admin/all-users', { headers });
      setAllUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Błąd ładowania użytkowników:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('http://localhost:5000/api/admin/stats', { headers });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Błąd ładowania statystyki:', error);
    }
  };

  const handleDeleteUserClick = (userId, userName) => {
    setConfirm({
      show: true,
      message: `Czy na pewno chcesz usunąć użytkownika ${userName}?`,
      onConfirm: () => handleDeleteUser(userId)
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, { headers });
      
      // Обновляем список пользователей после удаления
      setAllUsers(allUsers.filter(user => user.id !== userId));
      setAlert({ show: true, message: 'Użytkownik został usunięty pomyślnie', type: 'success' });
      
      // Обновляем статистику
      fetchStats();
    } catch (error) {
      console.error('Błąd usuwania użytkownika:', error);
      const errorMessage = error.response?.data?.message || 'Nie udało się usunąć użytkownika';
      setAlert({ show: true, message: `Błąd: ${errorMessage}`, type: 'error' });
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h1>Panel Administratora</h1>
        <div className="loading">Ładowanie użytkowników...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel Administratora</h1>
        <button 
          onClick={() => navigate('/admin/orders')} 
          className="orders-btn"
        >
          📦 Wszystkie Zamówienia
        </button>
      </div>
      
      {/* Контейнер статистики */}
      {stats && (
        <div className="statistics-section">
          <h2>Statystyka</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-label">Wszystkich zamówień</div>
                <div className="stat-number">{stats.totalOrders}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎂</div>
              <div className="stat-content">
                <div className="stat-label">Tortów sprzedanych</div>
                <div className="stat-number">{stats.totalCakesSold || 0}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-label">Całkowity przychód</div>
                <div className="stat-number">{stats.totalRevenue?.toFixed(2) || '0.00'} zł</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-label">Wszystkich użytkowników</div>
                <div className="stat-number">{stats.totalUsers}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🍰</div>
              <div className="stat-content">
                <div className="stat-label">Produktów w ofercie</div>
                <div className="stat-number">{stats.totalProducts}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <h2>Lista Wszystkich Użytkowników</h2>
        
        <div className="users-header">
          <div className="user-count">
            Łącznie użytkowników: {allUsers.length}
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Szukaj użytkowników (imię, nazwisko, email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">Wszystkie role</option>
              <option value="admin">Administratorzy</option>
              <option value="user">Użytkownicy</option>
            </select>
          </div>
        </div>

        {/* Список пользователей */}
        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="no-users">
              Nie znaleziono użytkowników
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="user-item"
              >
                <div 
                  className="user-info clickable"
                  onClick={() => navigate(`/admin/user/${user.id}`)}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase()}{user.surname?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">
                      {user.name} {user.surname}
                    </div>
                    <div className="user-email">{user.email}</div>
                    <div className={`user-role role-${user.role}`}>
                      {user.role === 'admin' ? '👑 Administrator' : '👤 Użytkownik'}
                    </div>
                  </div>
                </div>
                
                <div className="user-right-section">
                  <div className="user-dates">
                    <div className="user-created">
                      📅 Zarejestrowany: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="user-updated">
                      🔄 Ostatnia aktywność: {new Date(user.updatedAt).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="user-id">ID: {user.id}</div>
                  </div>
                  <button
                    className="delete-user-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUserClick(user.id, `${user.name} ${user.surname}`);
                    }}
                    title="Usuń użytkownika"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Статистика */}
        <div className="users-stats">
          <div className="stat-item">
            <span className="stat-label">Administratorzy:</span>
            <span className="stat-value">{allUsers.filter(u => u.role === 'admin').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Użytkownicy:</span>
            <span className="stat-value">{allUsers.filter(u => u.role === 'user').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Wszystkich:</span>
            <span className="stat-value">{allUsers.length}</span>
          </div>
        </div>
      </div>
      <AlertModal
        message={alert.message}
        type={alert.type}
        show={alert.show}
        onClose={() => setAlert({ show: false, message: "", type: "info" })}
      />
      <ConfirmModal
        message={confirm.message}
        show={confirm.show}
        onConfirm={() => {
          if (confirm.onConfirm) confirm.onConfirm();
          setConfirm({ show: false, message: "", onConfirm: null });
        }}
        onCancel={() => setConfirm({ show: false, message: "", onConfirm: null })}
      />
    </div>
  );
};

export default AdminDashboard;
