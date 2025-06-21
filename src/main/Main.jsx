import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";
import { useUser } from "../UserContext";
import "../styles/main.scss";
import Onas from "../components/Onas";

const Main = () => {
  const { userName, userId } = useUser();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cake")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
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

  useEffect(() => {
    let filtered = [...products];

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтрация по цене
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Сортировка
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, sortBy, products]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (e, type) => {
    const value = Number(e.target.value);
    setPriceRange({ ...priceRange, [type]: value });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="main">
      <h1>Witam, {userName ? userName : "gosc"}!</h1>

      <div className="filter-container">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Szukaj po nazwie..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-price">
          <label>Cena:</label>
          <input
            type="number"
            placeholder="Мин"
            value={priceRange.min}
            onChange={(e) => handlePriceChange(e, "min")}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Макс"
            value={priceRange.max}
            onChange={(e) => handlePriceChange(e, "max")}
            min="0"
          />
        </div>
        <div className="filter-sort">
          <label>Sortowanie:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name-asc">Po nazwie (A-Z)</option>
            <option value="name-desc">Po nazwie (Z-А)</option>
            <option value="price-asc">По цене (rosnący)</option>
            <option value="price-desc">Po cenie (malejący)</option>
          </select>
        </div>
      </div>

      {loading && <p>Ladowanie...</p>}
      {error && <p>{error}</p>}

      <div className="product-grid">
        <ProductList products={filteredProducts} addToCart={addToCart} />
      </div>

      <Onas />
    </div>
  );
};

export default Main;