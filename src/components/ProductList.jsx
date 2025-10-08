import React, { useState } from "react";
import Modal from "./Modal";
import { useUser } from "../UserContext";
import axios from "axios";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import "../styles/productList.scss";

const ProductList = ({ products, onProductDeleted }) => {
  const { userName, userRole } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

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
      alert("Proszę zalogować się, aby dodać produkty do koszyka");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Proszę zalogować się, aby dodać produkty do koszyka");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // if (response.data.success) {
      //   setCartMessage('Produkt dodany do koszyka!');
      //   setTimeout(() => setCartMessage(''), 3000);
      // }
    } catch (error) {
      console.error("Błąd podczas dodawania produktu do koszyka", error);
      setCartMessage("Błąd podczas dodawania produktu do koszyka");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten tort?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cake/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Tort został pomyślnie usunięty!");
      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      console.error("Błąd podczas usuwania produktu", error);
      alert("Błąd podczas usuwania: " + (error.response?.data?.message || "Nie udało się usunąć tortu"));
    }
  };

  return (
    <div className="product-cards">
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
      {products.length === 0 ? (
        <p>Nie ma towarów</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => openModal(product)}
          >
            <div className="image-wrapper">
              {product.image_url ? (
                <img
                  src={`http://localhost:5000${product.image_url}`}
                  alt={product.name}
                />
              ) : (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999'}}>
                  No image
                </div>
              )}
              {product.category && (
                <div className="product-badge">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
              )}
            </div>
            
            <div className="card-content">
              <h3>{product.name}</h3>
              <div className="price">
                {product.price} <span>zł</span>
              </div>
            </div>

            <div className="product-actions">
              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product.id);
                }}
              >
                <FaShoppingCart size={18} />
                Do koszyka
              </button>
              {userRole === 'admin' && (
                <button
                  className="delete-product-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProduct(product.id);
                  }}
                >
                  <FaTrash size={16} />
                </button>
              )}
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
