// src/components/AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/addproduct.scss";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [opis, setOpis] = useState(""); // Изменено с 'description' на 'opis'
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("opis", opis); // Изменено с 'description' на 'opis'
    formData.append("price", price);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/cake", formData);
      navigate("/"); // Перенаправляем на главную после добавления продукта
    } catch (error) {
      console.error("Ошибка при добавлении продукта", error);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Добавить продукт</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Описание"
          value={opis} // Изменено с 'description' на 'opis'
          onChange={(e) => setOpis(e.target.value)} // Изменено с 'description' на 'opis'
          required
        />
        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Dodaj tort</button>
      </form>
    </div>
  );
};

export default AddProduct;
