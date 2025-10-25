import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/adminDashboard.scss';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [ordersStats, setOrdersStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [usersStats, setUsersStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, ordersRes, productsRes, usersRes, allUsersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', { headers }),
        axios.get('http://localhost:5000/api/admin/orders-stats', { headers }),
        axios.get('http://localhost:5000/api/admin/top-products', { headers }),
        axios.get('http://localhost:5000/api/admin/users-stats', { headers }),
        axios.get('http://localhost:5000/api/admin/all-users', { headers })
      ]);

      setStats(statsRes.data.stats);
      setOrdersStats(ordersRes.data.ordersStats);
      setTopProducts(productsRes.data.topProducts);
      setUsersStats(usersRes.data.usersStats);
      setAllUsers(allUsersRes.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-dashboard">Ładowanie...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Panel Administratora</h1>
      
      {/* Общая статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Użytkownicy</h3>
          <div className="stat-number">{stats?.totalUsers}</div>
        </div>
        <div className="stat-card">
          <h3>Produkty</h3>
          <div className="stat-number">{stats?.totalProducts}</div>
        </div>
        <div className="stat-card">
          <h3>Zamówienia</h3>
          <div className="stat-number">{stats?.totalOrders}</div>
        </div>
        <div className="stat-card">
          <h3>Przychód</h3>
          <div className="stat-number">{stats?.totalRevenue} zł</div>
        </div>
      </div>

      {/* Статистика пользователей */}
      <div className="dashboard-section">
        <h2>Statystyki Użytkowników</h2>
        <div className="users-stats">
          {usersStats?.byRole?.map((role, index) => (
            <div key={index} className="role-stat">
              <span className="role-name">{role.role === 'admin' ? 'Administratorzy' : 'Użytkownicy'}</span>
              <span className="role-count">{role.count}</span>
            </div>
          ))}
          <div className="new-users">
            Nowych użytkowników w tym miesiącu: {usersStats?.newUsersLastMonth}
          </div>
        </div>
      </div>

      {/* Топ продуктов */}
      <div className="dashboard-section">
        <h2>Najlepsze Produkty</h2>
        <div className="top-products">
          {topProducts?.slice(0, 5).map((product, index) => (
            <div key={product.id} className="product-item">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-stats">
                  Zamówień: {product.orders_count} | 
                  Ilość: {product.total_quantity} | 
                  Cena: {product.price} zł
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* История всех пользователей */}
      <div className="dashboard-section">
        <h2>Historia Wszystkich Użytkowników</h2>
        <div className="users-history">
          {allUsers?.map((user, index) => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <div className="user-name">{user.name} {user.surname}</div>
                <div className="user-email">{user.email}</div>
                <div className={`user-role role-${user.role}`}>
                  {user.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                </div>
              </div>
              <div className="user-dates">
                <div className="user-created">
                  Zarejestrowany: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                </div>
                <div className="user-updated">
                  Ostatnia aktywność: {new Date(user.updatedAt).toLocaleDateString('pl-PL')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
