import React, { useState } from "react";
import Modal from "./Modal";
import { useUser } from "../UserContext"; // Импортируем хук контекста
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa"; // Иконка для корзины
import "../styles/productList.scss";

const ProductList = ({ products }) => {
  const { userName } = useUser(); // Получаем имя пользователя
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState(""); // Сообщение для корзины

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const addToCart = async (productId) => {
    if (!userName) {
      alert("Пожалуйста, войдите, чтобы добавить товары в корзину");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Получаем токен пользователя
      if (!token) {
        alert("Пожалуйста, войдите, чтобы добавить товары в корзину");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { productId }, // Отправляем productId на сервер
        { headers: { Authorization: `Bearer ${token}` } } // Передаем токен в заголовках
      );

      // if (response.data.success) {
      //   setCartMessage('Товар добавлен в корзину!');
      //   setTimeout(() => setCartMessage(''), 3000); // Убираем сообщение через 3 секунды
      // }
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину", error);
      setCartMessage("Ошибка при добавлении товара в корзину");
    }
  };

  return (
    <div className="product-cards">
      {cartMessage && <div className="cart-message">{cartMessage}</div>}{" "}
      {/* Сообщение о добавлении в корзину */}
      {products.length === 0 ? (
        <p>Nie ma towarow</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => openModal(product)} // Открытие модального окна при клике на карточку
          >
            {product.image_url ? (
              <img
                src={`http://localhost:5000${product.image_url}`}
                alt={product.name}
              />
            ) : (
              <p>No image available</p>
            )}
            <h3>{product.name}</h3>
            <p>{product.price} zl.</p>

            <div className="product-actions">
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Предотвращаем открытие модала при клике на кнопку
                  addToCart(product.id);
                }}
              >
                <FaShoppingCart size={20} /> {/* Иконка корзины */}
              </button>
            </div>
          </div>
        ))
      )}
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} closeModal={closeModal} />
      )}
    </div>
  );
};

export default ProductList;
