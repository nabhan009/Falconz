// import React, { useContext } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const ProtectedRoute = ({ children, requireAuth = true }) => {
//   const { user } = useContext(AuthContext);
//   const location = useLocation();

//   if (requireAuth && !user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!requireAuth && user) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true, requiredRole }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 🚫 Not logged in → redirect to login
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚷 Logged in but not allowed (wrong role)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // 🚪 Logged in user visiting login/signup → send to home
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
