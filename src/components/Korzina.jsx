import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/korzina.scss";

const Korzina = () => {
  const { userId: contextUserId } = useUser();
  const [userId, setUserId] = useState(
    contextUserId || localStorage.getItem("userId")
  );
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUserIdLoaded, setIsUserIdLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = contextUserId || localStorage.getItem("userId");
    setUserId(storedUserId);
    if (storedUserId) {
      setIsUserIdLoaded(true);
    }
  }, [contextUserId]);

  useEffect(() => {
    if (isUserIdLoaded) {
      fetchCartItems();
    }
  }, [isUserIdLoaded]);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("Пользователь не авторизован");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Прямо передаем данные, предполагая, что ответ сервера - это массив товаров
      setCartItems(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Ошибка при загрузке корзины:", err);
      setError("Не удалось загрузить корзину");
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.product.id !== productId));
    } catch (err) {
      setError("Не удалось удалить товар");
    }
  };

  const updateQuantity = async (productId, delta) => {
    const token = localStorage.getItem("token");
    try {
      const item = cartItems.find((item) => item.product.id === productId);
      const newQuantity = Math.max(1, item.quantity + delta);

      // Обновляем сервер
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Обновляем состояние локально
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError("Не удалось обновить количество");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/zamowienie");
  };

  return (
    <div className="korzina-container">
      <h2>🛒 Wasz koszyk</h2>
      {loading && <p>Ladowanie...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && cartItems.length === 0 ? (
        <p>Koszyk pusty.</p>
      ) : (
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
                className="product-image"
              />
              <div className="cart-info">
                <h3>{item.product.name}</h3>
                <p>{item.product.price} zl</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)}>
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Usun
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Suma zamowenia {totalPrice} zl</h3>
          <h4>Ilosc towarow: {totalItems}</h4>
          <button className="checkout-btn" onClick={handleCheckout}>
           Akceptuj zamowenie
          </button>
        </div>
      )}
    </div>
  );
};

export default Korzina;
