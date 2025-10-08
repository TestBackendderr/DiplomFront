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
      setError("Użytkownik nie jest zalogowany");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Błąd podczas ładowania koszyka:", err);
      setError("Nie udało się załadować koszyka");
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
      setError("Nie udało się usunąć produktu");
    }
  };

  const updateQuantity = async (productId, delta) => {
    const token = localStorage.getItem("token");
    try {
      const item = cartItems.find((item) => item.product.id === productId);
      const newQuantity = Math.max(1, item.quantity + delta);

      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      setError("Nie udało się zaktualizować ilości");
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
                <p>{item.product.price} zł</p>
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
          <h3>Suma zamowenia {totalPrice} zł</h3>
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
