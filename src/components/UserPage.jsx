import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/userPage.scss";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    kraj: "",
    miasto: "",
    ulica: "",
    nrdomu: "",
    telefon: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.userData);

        const userInfoResponse = await axios.get(
          "http://localhost:5000/api/user-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserInfo(userInfoResponse.data.userInfo.UserInfo);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setFormData({
      kraj: userInfo?.kraj,
      miasto: userInfo?.miasto,
      ulica: userInfo?.ulica,
      nrdomu: userInfo?.nrdomu,
      telefon: userInfo?.telefon,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:5000/api/user-info",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserInfo({ ...userInfo, ...formData });
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="user-page__error">{error}</div>;
  }

  if (!user) {
    return <div className="user-page__loading">Loading...</div>;
  }

  return (
    <div className="user-page">
      <h1 className="user-page__title">Dane uzytkownika</h1>
      <div className="user-page__info">
        <p>
          Imie: {user.imie} {user.nazwisko}
        </p>
        <p>Email: {user.email}</p>
      </div>

      {isEditing ? (
        <form className="user-page__form" onSubmit={handleSubmit}>
          <div className="user-page__form-group">
            <label>Kraj:</label>
            <input
              type="text"
              name="kraj"
              value={formData.kraj}
              onChange={handleInputChange}
              placeholder="Enter country"
              id="user-page__input-country"
            />
          </div>
          <div className="user-page__form-group">
            <label>Miasto:</label>
            <input
              type="text"
              name="miasto"
              value={formData.miasto}
              onChange={handleInputChange}
              placeholder="Enter city"
              id="user-page__input-city"
            />
          </div>
          <div className="user-page__form-group">
            <label>Ulica:</label>
            <input
              type="text"
              name="ulica"
              value={formData.ulica}
              onChange={handleInputChange}
              placeholder="Enter street"
              id="user-page__input-street"
            />
          </div>
          <div className="user-page__form-group">
            <label>Nr Domu:</label>
            <input
              type="text"
              name="nrdomu"
              value={formData.nrdomu}
              onChange={handleInputChange}
              placeholder="Enter house number"
              id="user-page__input-house-number"
            />
          </div>
          <div className="user-page__form-group">
            <label>Telefon:</label>
            <input
              type="text"
              name="telefon"
              value={formData.telefon}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              id="user-page__input-phone"
            />
          </div>
          <div className="user-page__form-actions">
            <button
              type="submit"
              className="user-page__btn-submit"
              id="user-page__btn-save"
            >
              Save
            </button>
            <button
              type="button"
              className="user-page__btn-cancel"
              id="user-page__btn-cancel"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {userInfo ? (
            <div className="user-page__details">
              <h2 className="user-page__details-title">Dane dla dostawy</h2>
              <p>Kraj: {userInfo.kraj}</p>
              <p>Miasto: {userInfo.miasto}</p>
              <p>Ulica: {userInfo.ulica}</p>
              <p>Nr Domu: {userInfo.nrdomu}</p>
              <p>Telefon: {userInfo.telefon}</p>
              <button
                className="user-page__btn-edit"
                onClick={handleEditClick} // Use the new handler
                id="user-page__btn-edit"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="user-page__no-info">
              <p>No additional info available.</p>
              <button
                className="user-page__btn-edit"
                onClick={handleEditClick} // Use the new handler
                id="user-page__btn-add-info"
              >
                Add Info
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPage;
