import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true, requiredRole }) => {
  const { user } = useContext(AuthContext);

  //  Logged in but not allowed
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  //  Logged in user visiting login/signup
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
