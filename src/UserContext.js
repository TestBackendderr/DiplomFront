import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  const updateUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.userName);
        setUserId(decoded.userId);
        localStorage.setItem("userId", decoded.userId); // добавляем для корзины
      } catch (error) {
        console.error("Invalid or expired token");
        setUserName(null);
        setUserId(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    }
  };

  useEffect(() => {
    updateUserFromToken();
  }, []);

  return (
    <UserContext.Provider
      value={{ userName, userId, setUserName, setUserId, updateUserFromToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
