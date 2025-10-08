import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useUser } from "../UserContext";
import axios from "axios";
import "../styles/navbar.scss";

const Navbar = () => {
  const { userName, userId, userRole, setUserName, setUserId, setUserRole, updateUserFromToken } = useUser();
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateUserName = () => {
    updateUserFromToken();
  };

  const fetchCartItemCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const totalItemCount = response.data.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemCount(totalItemCount);
    } catch (error) {
      console.error("Błąd podczas pobierania koszyka:", error);
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    updateUserName();
    const handleStorageChange = () => updateUserName();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUserName, setUserId]);

  useEffect(() => {
    if (userId) fetchCartItemCount();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const intervalId = setInterval(fetchCartItemCount, 5000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName(null);
    setUserId(null);
    setUserRole(null);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <h1>Tortowy Świat</h1>
      </Link>

      <div className="navbar-links">
        {userName ? (
          <div>
            <Link to="/user" className="navbar-link">
              Witaj, {userName}
            </Link>
            {userRole === 'admin' && (
              <Link to="/add-product" className="navbar-link">
                Dodaj Produkt
              </Link>
            )}
            <button onClick={handleLogout}>Wyloguj</button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="navbar-link">
              Zaloguj
            </Link>
            <Link to="/register" className="navbar-link">
              Zarejestruj
            </Link>
          </div>
        )}

        <Link to="/korzina" className="navbar-link cart-icon">
          <FaShoppingCart size={20} />
          <span>({cartItemCount})</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
