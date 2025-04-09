import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";
import { useUser } from "../UserContext";
import "../styles/main.scss";
import Onas from "../components/Onas";

const Main = () => {
  const { userName, userId } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cake")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Ошибка при загрузке товаров");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке корзины:", error);
        });
    }
  }, [userId]);

  const addToCart = async (product) => {
    if (!userId) {
      alert("Пожалуйста, войдите в систему, чтобы добавить товар в корзину");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart([...cart, response.data.product]);
        alert("Товар добавлен в корзину");
      }
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину", error);
    }
  };

  return (
    <div className="main">
      <h1>Привет, {userName ? userName : "гость"}!</h1>

      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}

      <div className="product-grid">
        <ProductList products={products} addToCart={addToCart} />
      </div>

      <Onas />
    </div>
  );
};

export default Main;
