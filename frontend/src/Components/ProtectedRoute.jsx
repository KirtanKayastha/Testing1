// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loadingUser } = useContext(AuthContext);


// ✅ Wait until user is restored (prevents redirect on refresh)
  if (loadingUser) return null; // Or a loading spinner <div>Loading...</div>

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
