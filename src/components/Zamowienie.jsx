import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import "../styles/zamowienie.scss";

const Zamowienie = () => {
  const { userId: contextUserId } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    address: "",
    paymentMethod: "card",
  });

  const userId = contextUserId || localStorage.getItem("userId");

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

      setCartItems(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Не удалось загрузить корзину");
      setLoading(false);
    }
  };

  const fetchUserAddress = async () => {
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("Пользователь не авторизован");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/user-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fullAddress = `${response.data.userInfo.UserInfo.miasto}, ${response.data.userInfo.UserInfo.ulica} ${response.data.userInfo.UserInfo.nrdomu}`;

      {
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          address: fullAddress,
        }));
      }
    } catch (err) {
      setError("Не удалось получить адрес доставки");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchUserAddress();
    } else {
      console.log("Waiting for userId to be set...");
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("Пользователь не авторизован");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/order",
        {
          userId,
          cartItems,
          orderDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Заказ успешно оформлен!");
    } catch (err) {
      console.error("Ошибка при оформлении заказа:", err);
      setError("Не удалось оформить заказ");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="zamowienie-container">
      <h2>Składanie zamówień</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && cartItems.length === 0 ? (
        <p>W koszyku nie ma żadnych pozycji do realizacji zakupu.Checkout</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="order-summary">
            <h3>Товары в заказе:</h3>
            {cartItems.map((item, index) => (
              <p key={item.product_id || `item-${index}`}>
                {item.product.name} - {item.product.price} zl x {item.quantity}
              </p>
            ))}
            <p>
              <strong>Łączna kwota: {totalPrice} zl</strong>
            </p>
          </div>

          <div className="order-details">
            <label htmlFor="address">Adres dostawy:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={orderDetails.address}
              onChange={handleChange}
              required
            />
            <label>Способ оплаты:</label>
            <select
              name="paymentMethod"
              value={orderDetails.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="card">Karta</option>
              <option value="cash">Gotowka</option>
            </select>
          </div>

          <button type="submit">Potwierdź zamówienie</button>
        </form>
      )}
    </div>
  );
};

export default Zamowienie;
