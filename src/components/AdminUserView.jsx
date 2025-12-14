import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import '../styles/adminUserView.scss';

const AdminUserView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchUserReviews();
    fetchUserCart();
    fetchUserOrders();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}`, { headers });
      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      console.error('Błąd ładowania danych użytkownika:', err);
      setError('Nie udało się załadować danych użytkownika');
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`http://localhost:5000/api/reviews/user/${userId}`, { headers });
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Błąd ładowania opinii:', err);
    }
  };

  const fetchUserCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}/cart`, { headers });
      setCartItems(response.data.cart || []);
    } catch (err) {
      console.error('Błąd ładowania koszyka:', err);
    }
  };

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}/orders`, { headers });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Błąd ładowania zamówień:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "star filled" : "star"}
        size={20}
      />
    ));
  };

  if (loading) {
    return (
      <div className="admin-user-view">
        <div className="loading">Ładowanie...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-user-view">
        <div className="error">{error || 'Użytkownik nie znaleziony'}</div>
        <button onClick={() => navigate('/admin')} className="back-btn">
          Powrót do panelu administratora
        </button>
      </div>
    );
  }

  return (
    <div className="admin-user-view">
      <div className="header-section">
        <button onClick={() => navigate('/admin')} className="back-btn">
          ← Powrót do listy użytkowników
        </button>
        <h1>Profil Użytkownika</h1>
      </div>

      <div className="user-info-section">
        <div className="user-card">
          <div className="user-avatar-large">
            {user.name?.charAt(0).toUpperCase()}{user.surname?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h2>{user.name} {user.surname}</h2>
            <p className="user-email">{user.email}</p>
            <div className={`role-badge role-${user.role}`}>
              {user.role === 'admin' ? '👑 Administrator' : '👤 Użytkownik'}
            </div>
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-label">ID:</span>
                <span className="stat-value">{user.id}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Zarejestrowany:</span>
                <span className="stat-value">
                  {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                </span>
              </div>
              {user.total_orders !== undefined && (
                <div className="stat-item">
                  <span className="stat-label">Zamówień:</span>
                  <span className="stat-value">{user.total_orders}</span>
                </div>
              )}
              {user.total_spent !== undefined && (
                <div className="stat-item">
                  <span className="stat-label">Wydano:</span>
                  <span className="stat-value">{parseFloat(user.total_spent).toFixed(2)} zł</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Opinie Klientów</h2>
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Ten użytkownik nie ma jeszcze żadnych opinii.</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-user-info">
                    <div className="review-rating">{renderStars(review.rating)}</div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="orders-section">
        <h2>📦 Historia Zamówień</h2>
        {loadingOrders ? (
          <div className="loading-orders">
            <p>Ładowanie zamówień...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>Użytkownik nie ma jeszcze żadnych zamówień.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
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
                    <span className="info-value total-price">{parseFloat(order.totalPrice).toFixed(2)} zł</span>
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
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cart-section">
        <h2>🛒 Koszyk Użytkownika</h2>
        {cartItems.length === 0 ? (
          <div className="no-cart">
            <p>Koszyk użytkownika jest pusty.</p>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-card">
                  <img
                    src={
                      item.product.image_url
                        ? `http://localhost:5000${item.product.image_url}`
                        : "/placeholder.jpg"
                    }
                    alt={item.product.name}
                    className="cart-product-image"
                  />
                  <div className="cart-info">
                    <h3>{item.product.name}</h3>
                    <p className="cart-price">{item.product.price} zł</p>
                    <div className="cart-quantity">
                      <span className="quantity-label">Ilość:</span>
                      <span className="quantity-value">{item.quantity}</span>
                    </div>
                    <div className="cart-subtotal">
                      Suma: {(item.product.price * item.quantity).toFixed(2)} zł
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-item">
                <span className="summary-label">Łączna ilość:</span>
                <span className="summary-value">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Łączna suma:</span>
                <span className="summary-value">
                  {cartItems
                    .reduce((total, item) => total + item.product.price * item.quantity, 0)
                    .toFixed(2)} zł
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserView;

