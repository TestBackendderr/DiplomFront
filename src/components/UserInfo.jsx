import React, { useState } from "react";
import axios from "axios";

const UserInfo = () => {
  const [kraj, setKraj] = useState("");
  const [miasto, setMiasto] = useState("");
  const [ulica, setUlica] = useState("");
  const [nrdomu, setNrdomu] = useState("");
  const [telefon, setTelefon] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Получаем токен из localStorage

    if (!token) {
      setError("No token found");
      return;
    }

    try {
      // Отправляем данные на сервер для добавления в таблицу user_info
      const response = await axios.put(
        "http://localhost:5000/api/user-info",
        {
          kraj,
          miasto,
          ulica,
          nrdomu,
          telefon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("User information saved successfully!");
        setError("");
      }
    } catch (err) {
      setError("Error saving user information");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Enter your information</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={kraj}
            onChange={(e) => setKraj(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={miasto}
            onChange={(e) => setMiasto(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Street:</label>
          <input
            type="text"
            value={ulica}
            onChange={(e) => setUlica(e.target.value)}
            required
          />
        </div>
        <div>
          <label>House Number:</label>
          <input
            type="text"
            value={nrdomu}
            onChange={(e) => setNrdomu(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserInfo;
