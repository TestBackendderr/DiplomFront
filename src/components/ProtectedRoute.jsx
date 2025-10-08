import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { userName, userRole, updateUserFromToken } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // При монтировании проверяем токен
    const token = localStorage.getItem("token");
    if (token && !userName) {
      updateUserFromToken();
    }
    setIsChecking(false);
  }, [userName, updateUserFromToken]);

  // Пока проверяем - показываем загрузку
  if (isChecking) {
    return <div>Ładowanie...</div>;
  }

  // Проверяем наличие токена
  const token = localStorage.getItem("token");
  if (!token || !userName) {
    // Если не авторизован - редирект на логин
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== 'admin') {
    // Если требуется админ, но пользователь не админ - редирект на главную
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
