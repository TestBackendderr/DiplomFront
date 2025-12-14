import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import axios from "axios";
import AlertModal from "./AlertModal";
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
  const [userData, setUserData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });

  const userId = contextUserId || localStorage.getItem("userId");

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
      setError("Nie udało się załadować koszyka");
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("Użytkownik nie jest zalogowany");
      return;
    }

    try {
      const [userResponse, userInfoResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/user-info`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userCoreData = userResponse.data?.userData || null;
      const userDeliveryInfo = userInfoResponse.data?.userInfo?.UserInfo || null;

      setUserData(userCoreData);
      setDeliveryData(userDeliveryInfo);

      if (
        userDeliveryInfo?.miasto &&
        userDeliveryInfo?.ulica &&
        userDeliveryInfo?.nrdomu
      ) {
        const fullAddress = `${userDeliveryInfo.miasto}, ${userDeliveryInfo.ulica} ${userDeliveryInfo.nrdomu}`;
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          address: fullAddress,
        }));
      } else {
        setError("Uzupełnij dane dostawy w profilu użytkownika");
      }
    } catch (err) {
      setError("Nie udało się pobrać adresu dostawy");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchUserProfile();
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
      setError("Użytkownik nie jest zalogowany");
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
      setAlert({ show: true, message: "Zamówienie zostało pomyślnie złożone!", type: "success" });
    } catch (err) {
      console.error("Błąd podczas składania zamówienia:", err);
      setError("Nie udało się złożyć zamówienia");
      setAlert({ show: true, message: "Nie udało się złożyć zamówienia", type: "error" });
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="zamowienie-container">
      <h2>Składanie zamówienia</h2>

      {loading && <p>Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && cartItems.length === 0 ? (
        <p>W koszyku nie ma żadnych pozycji do realizacji zakupu</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="order-summary">
            <h3>Produkty w zamówieniu:</h3>
            {cartItems.map((item, index) => (
              <p key={item.product_id || `item-${index}`}>
                {item.product.name} - {item.product.price} zł x {item.quantity}
              </p>
            ))}
            <p>
              <strong>Łączna kwota: {totalPrice} zł</strong>
            </p>
          </div>

          <div className="order-details">
            <div className="order-details__section">
              <h3>Dane użytkownika</h3>
              {userData ? (
                <>
                  <p>
                    {userData.imie} {userData.nazwisko}
                  </p>
                  <p>Email: {userData.email}</p>
                </>
              ) : (
                <p>Ładowanie danych użytkownika...</p>
              )}
            </div>

            <div className="order-details__section">
              <h3>Dane dla dostawy</h3>
              {deliveryData ? (
                <>
                  <p>Kraj: {deliveryData.kraj || "—"}</p>
                  <p>Miasto: {deliveryData.miasto || "—"}</p>
                  <p>
                    Ulica: {deliveryData.ulica || "—"} {deliveryData.nrdomu || ""}
                  </p>
                  <p>Telefon: {deliveryData.telefon || "—"}</p>
                  <label htmlFor="address">Adres dostawy:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={orderDetails.address}
                    readOnly
                  />
                  <small>
                    Adres pochodzi z sekcji „Dane dla dostawy”. Zmień go w profilu
                    użytkownika, jeśli to konieczne.
                  </small>
                </>
              ) : (
                <p>Uzupełnij dane dostawy w profilu użytkownika.</p>
              )}
            </div>

            <label>Metoda płatności:</label>
            <select
              name="paymentMethod"
              value={orderDetails.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="card">Karta</option>
              <option value="cash">Gotówka</option>
            </select>
          </div>

          <button type="submit">Potwierdź zamówienie</button>
        </form>
      )}
      <AlertModal
        message={alert.message}
        type={alert.type}
        show={alert.show}
        onClose={() => setAlert({ show: false, message: "", type: "info" })}
      />
    </div>
  );
};

export default Zamowienie;
