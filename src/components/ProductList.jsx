import React, { useState } from "react";
import Modal from "./Modal";
import AlertModal from "./AlertModal";
import ConfirmModal from "./ConfirmModal";
import EditProductModal from "./EditProductModal";
import { useUser } from "../UserContext";
import axios from "axios";
import { FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa";
import "../styles/productList.scss";

const ProductList = ({ products, onProductDeleted }) => {
  const { userName, userRole } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState({ show: false, message: "", onConfirm: null });

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
      setAlert({ show: true, message: "Proszę zalogować się, aby dodać produkty do koszyka", type: "warning" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ show: true, message: "Proszę zalogować się, aby dodać produkty do koszyka", type: "warning" });
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAlert({ show: true, message: "Produkt dodany do koszyka!", type: "success" });
      }
    } catch (error) {
      console.error("Błąd podczas dodawania produktu do koszyka", error);
      setAlert({ show: true, message: "Błąd podczas dodawania produktu do koszyka", type: "error" });
    }
  };

  const handleEditClick = (product, e) => {
    e.stopPropagation();
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductUpdated = () => {
    if (onProductDeleted) {
      onProductDeleted();
    }
  };

  const handleDeleteClick = (productId) => {
    setConfirm({
      show: true,
      message: "Czy na pewno chcesz usunąć ten tort?",
      onConfirm: () => deleteProduct(productId)
    });
  };

  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cake/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAlert({ show: true, message: "Tort został pomyślnie usunięty!", type: "success" });
      if (onProductDeleted) {
        onProductDeleted();
      }
    } catch (error) {
      console.error("Błąd podczas usuwania produktu", error);
      setAlert({ show: true, message: "Błąd podczas usuwania: " + (error.response?.data?.message || "Nie udało się usunąć tortu"), type: "error" });
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
                <>
                  <button
                    className="edit-product-btn"
                    onClick={(e) => handleEditClick(product, e)}
                    title="Edytuj produkt"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="delete-product-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(product.id);
                    }}
                    title="Usuń produkt"
                  >
                    <FaTrash size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} closeModal={closeModal} />
      )}
      {isEditModalOpen && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={handleEditClose}
          onProductUpdated={handleProductUpdated}
        />
      )}
      <AlertModal
        message={alert.message}
        type={alert.type}
        show={alert.show}
        onClose={() => setAlert({ show: false, message: "", type: "info" })}
      />
      <ConfirmModal
        message={confirm.message}
        show={confirm.show}
        onConfirm={() => {
          if (confirm.onConfirm) confirm.onConfirm();
          setConfirm({ show: false, message: "", onConfirm: null });
        }}
        onCancel={() => setConfirm({ show: false, message: "", onConfirm: null })}
      />
    </div>
  );
};

export default ProductList;
