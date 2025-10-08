import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const updateUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.userName);
        setUserId(decoded.userId);
        setUserRole(decoded.role);
        localStorage.setItem("userId", decoded.userId);
      } catch (error) {
        console.error("Nieprawidłowy lub wygasły token");
        setUserName(null);
        setUserId(null);
        setUserRole(null);
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
      value={{ userName, userId, userRole, setUserName, setUserId, setUserRole, updateUserFromToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
