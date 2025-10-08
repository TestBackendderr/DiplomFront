import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "../styles/auth.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUserFromToken } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Обновляем все данные пользователя из токена (включая role)
        updateUserFromToken();

        navigate("/");
      } else {
        setError("Błąd podczas logowania");
      }
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd podczas logowania");
    }
  };

  return (
    <div className="auth-container">
      <div>
        <h2>Zaloguj się</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Zaloguj</button>
      </form>
      {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
