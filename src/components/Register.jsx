import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.scss";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          surname,
          email,
          password,
        }
      );
      if (response.data.success) {
        navigate("/login");
      } else {
        setError("Błąd podczas rejestracji");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas rejestracji");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div>
        <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nazwisko"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zarejestruj</button>
      </form>
      {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
