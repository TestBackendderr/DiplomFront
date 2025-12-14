import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import '../styles/adminOrders.scss';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState({ show: false, message: "", onConfirm: null });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get('http://localhost:5000/api/admin/orders', { headers });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Błąd ładowania zamówień:', error);
      setAlert({ 
        show: true, 
        message: 'Nie udało się załadować zamówień', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = (orderId) => {
    setConfirm({
      show: true,
      message: 'Czy na pewno chcesz zakończyć to zamówienie?',
      onConfirm: () => updateOrderStatus(orderId, 'completed')
    });
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status },
        { headers }
      );
      
      setAlert({ 
        show: true, 
        message: 'Status zamówienia został zaktualizowany!', 
        type: 'success' 
      });
      
      // Обновляем список заказов
      fetchOrders();
    } catch (error) {
      console.error('Błąd aktualizacji statusu:', error);
      setAlert({ 
        show: true, 
        message: 'Nie udało się zaktualizować statusu zamówienia', 
        type: 'error' 
      });
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="loading">Ładowanie zamówień...</div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="header-section">
        <button onClick={() => navigate('/admin')} className="back-btn">
          ← Powrót do panelu administratora
        </button>
        <h1>Wszystkie Zamówienia</h1>
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <label>Filtruj według statusu:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Wszystkie</option>
            <option value="pending">Oczekujące</option>
            <option value="completed">Zrealizowane</option>
            <option value="cancelled">Anulowane</option>
          </select>
        </div>
        <div className="orders-count">
          Łącznie zamówień: {filteredOrders.length}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>Brak zamówień do wyświetlenia.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Zamówienie #{order.id}</strong>
                </div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className={`order-status status-${order.status}`}>
                  {order.status === 'pending' && '⏳ Oczekujące'}
                  {order.status === 'completed' && '✅ Zrealizowane'}
                  {order.status === 'cancelled' && '❌ Anulowane'}
                </div>
              </div>

              {order.user && (
                <div className="order-user">
                  <div className="user-info">
                    <span className="user-label">Klient:</span>
                    <span className="user-name">{order.user.name} {order.user.surname}</span>
                    <span className="user-email">({order.user.email})</span>
                  </div>
                  <button
                    className="view-user-btn"
                    onClick={() => navigate(`/admin/user/${order.user.id}`)}
                  >
                    Zobacz profil
                  </button>
                </div>
              )}

              <div className="order-details">
                <div className="order-info-item">
                  <span className="info-label">Adres:</span>
                  <span className="info-value">{order.address}</span>
                </div>
                <div className="order-info-item">
                  <span className="info-label">Metoda płatności:</span>
                  <span className="info-value">
                    {order.paymentMethod === 'card' ? '💳 Karta' : '💵 Gotówka'}
                  </span>
                </div>
                <div className="order-info-item">
                  <span className="info-label">Suma:</span>
                  <span className="info-value total-price">
                    {parseFloat(order.totalPrice).toFixed(2)} zł
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Produkty:</h4>
                <div className="items-list">
                  {order.items.map((item) => (
                    <div key={item.productId} className="order-item">
                      <img
                        src={
                          item.product.image_url
                            ? `http://localhost:5000${item.product.image_url}`
                            : "/placeholder.jpg"
                        }
                        alt={item.product.name}
                        className="order-item-image"
                      />
                      <div className="order-item-info">
                        <h5>{item.product.name}</h5>
                        <div className="order-item-details">
                          <span>Ilość: {item.quantity}</span>
                          <span>Cena za szt.: {parseFloat(item.price).toFixed(2)} zł</span>
                          <span className="item-total">
                            Suma: {(item.quantity * parseFloat(item.price)).toFixed(2)} zł
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'pending' && (
                <div className="order-actions">
                  <button
                    className="complete-order-btn"
                    onClick={() => handleCompleteOrder(order.id)}
                  >
                    Zakończ zamówienie
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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

export default AdminOrders;

