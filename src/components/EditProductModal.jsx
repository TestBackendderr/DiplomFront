import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AlertModal from "./AlertModal";
import "../styles/editProductModal.scss";
import { FaTimes } from "react-icons/fa";

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [name, setName] = useState("");
  const [opis, setOpis] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("domowe");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setOpis(product.opis || "");
      setPrice(product.price || "");
      setCategory(product.category || "domowe");
      setImagePreview(product.image_url ? `http://localhost:5000${product.image_url}` : null);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("opis", opis);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/cake/${product.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlert({ show: true, message: "Produkt został pomyślnie zaktualizowany!", type: "success" });
      setTimeout(() => {
        if (onProductUpdated) onProductUpdated();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Błąd podczas aktualizacji produktu", error);
      setAlert({ 
        show: true, 
        message: "Błąd: " + (error.response?.data?.message || "Nie udało się zaktualizować produktu"), 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="edit-product-modal-overlay" onClick={onClose}>
      <div className="edit-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-product-modal-header">
          <h2>Edytuj produkt</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nazwa</label>
            <input
              type="text"
              placeholder="Nazwa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Opis</label>
            <textarea
              placeholder="Opis"
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Cena (zł)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Cena"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Kategoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="domowe">Domowe</option>
              <option value="weselne">Weselne</option>
              <option value="dziecięce">Dziecięce</option>
              <option value="świąteczne">Świąteczne</option>
              <option value="piękne">Piękne</option>
            </select>
          </div>
          <div className="form-group">
            <label>Obraz</label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="file-select-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Wybierz plik
            </button>
            <small>Zostaw puste, aby zachować obecny obraz</small>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
        <AlertModal
          message={alert.message}
          type={alert.type}
          show={alert.show}
          onClose={() => setAlert({ show: false, message: "", type: "info" })}
        />
      </div>
    </div>
  );
};

export default EditProductModal;

