import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminPanel2.scss';

const AdminPanel2 = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchAllUsers();
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

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="admin-panel2">Ładowanie użytkowników...</div>;
  }

  return (
    <div className="admin-panel2">
      <div className="panel-header">
        <h1>Zarządzanie Użytkownikami</h1>
        <div className="user-count">
          Łącznie użytkowników: {allUsers.length}
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Szukaj użytkowników..."
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

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Najnowsi</option>
            <option value="oldest">Najstarsi</option>
            <option value="name">Po imieniu</option>
            <option value="email">Po email</option>
          </select>
        </div>
      </div>

      {/* Список пользователей */}
      <div className="users-list">
        {sortedUsers.length === 0 ? (
          <div className="no-users">
            Nie znaleziono użytkowników
          </div>
        ) : (
          sortedUsers.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                <div className="avatar-circle">
                  {user.name.charAt(0).toUpperCase()}{user.surname.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="user-details">
                <div className="user-name">
                  {user.name} {user.surname}
                </div>
                <div className="user-email">{user.email}</div>
                <div className="user-dates">
                  <span className="date-item">
                    📅 Zarejestrowany: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                  </span>
                  <span className="date-item">
                    🔄 Ostatnia aktywność: {new Date(user.updatedAt).toLocaleDateString('pl-PL')}
                  </span>
                </div>
              </div>

              <div className="user-actions">
                <div className={`role-badge role-${user.role}`}>
                  {user.role === 'admin' ? '👑 Administrator' : '👤 Użytkownik'}
                </div>
                <div className="user-id">ID: {user.id}</div>
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
  );
};

export default AdminPanel2;
