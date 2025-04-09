// src/components/Novinki.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/novinki.scss";

const Novinki = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cake") // Убедись, что этот эндпоинт существует
      .then((response) => {
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestProducts(sorted.slice(0, 3)); // Только последние 3
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки новинок:", error);
        setError("Не удалось загрузить новинки.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-text">Загрузка новинок...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="novinki-list">
      {latestProducts.map((product) => (
        <div className="novinki-card" key={product.id}>
          {product.image_url ? (
            <img
              src={`http://localhost:5000${product.image_url}`}
              alt={product.name}
              className="novinki-image"
            />
          ) : (
            <p className="no-image">Изображение отсутствует</p>
          )}
          <div className="novinki-card-info">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span className="price">{product.price}₽</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Novinki;
