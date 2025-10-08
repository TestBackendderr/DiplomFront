import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/addproduct.scss";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [opis, setOpis] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("domowe");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("opis", opis);
    formData.append("price", price);
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/cake", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas dodawania produktu", error);
      alert("Błąd: " + (error.response?.data?.message || "Nie udało się dodać tortu"));
    }
  };

  return (
    <div className="add-product-container">
      <h2>Dodaj produkt</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Opis"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cena"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
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
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Dodaj tort</button>
      </form>
    </div>
  );
};

export default AddProduct;
