import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";
import { useUser } from "../UserContext";
import "../styles/main.scss";
import Onas from "../components/Onas";
import Reviews from "../components/Reviews";

const Main = () => {
  const { userName, userId } = useUser();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedCategory, setSelectedCategory] = useState("wszystkie");

  useEffect(() => {
    fetchProducts();
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

    // Фильтрация по категории
    if (selectedCategory && selectedCategory !== "wszystkie") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
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
  }, [searchTerm, priceRange, sortBy, selectedCategory, products]);

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/cake")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Błąd podczas ładowania produktów");
        setLoading(false);
      });
  };

  const addToCart = async (product) => {
    if (!userId) {
      alert("Proszę zalogować się, aby dodać produkt do koszyka");
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
        alert("Produkt dodany do koszyka");
      }
    } catch (error) {
      console.error("Błąd podczas dodawania produktu do koszyka", error);
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
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange(e, "min")}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange(e, "max")}
            min="0"
          />
        </div>
        <div className="filter-category">
          <label>Kategoria:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="wszystkie">Wszystkie</option>
            <option value="domowe">Domowe</option>
            <option value="weselne">Weselne</option>
            <option value="dziecięce">Dziecięce</option>
            <option value="świąteczne">Świąteczne</option>
            <option value="piękne">Piękne</option>
          </select>
        </div>
        <div className="filter-sort">
          <label>Sortowanie:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name-asc">Po nazwie (A-Z)</option>
            <option value="name-desc">Po nazwie (Z-A)</option>
            <option value="price-asc">Po cenie (rosnąco)</option>
            <option value="price-desc">Po cenie (malejąco)</option>
          </select>
        </div>
      </div>

      {loading && <p>Ladowanie...</p>}
      {error && <p>{error}</p>}
      
      {!loading && products.length > 0 && filteredProducts.length === 0 && (
        <div style={{ 
          background: 'rgba(255, 105, 180, 0.1)', 
          padding: '30px', 
          borderRadius: '15px',
          marginTop: '30px'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#ff69b4', fontWeight: '600' }}>
            Nie znaleziono tortów z wybranymi filtrami 🍰
          </p>
          <p style={{ color: '#666' }}>
            Łącznie tortów: {products.length} | Znaleziono po filtrach: {filteredProducts.length}
          </p>
          <p style={{ color: '#666' }}>
            Cena: {priceRange.min} - {priceRange.max} zł
          </p>
          <button 
            onClick={() => {
              setPriceRange({ min: 0, max: 10000 });
              setSearchTerm("");
              setSelectedCategory("wszystkie");
            }}
            style={{
              background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '15px'
            }}
          >
            Resetuj filtry
          </button>
        </div>
      )}

      <ProductList products={filteredProducts} addToCart={addToCart} onProductDeleted={fetchProducts} />

      <Onas />
      <Reviews />
    </div>
  );
};

export default Main;