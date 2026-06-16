// src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const ProtectedRoute = ({ children, roles }) => {
//   const user = useSelector((state) => state.auth.user);

//   if (!user) return <Navigate to="/" />;
//   if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;

//   return children;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/" />;

  const currentRole = (user?.role || '').toString().toLowerCase();
  const allowed = (allowedRoles || []).map((r) => (r || '').toString().toLowerCase());

  if (allowed.includes(currentRole)) return <Outlet />;

  return <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
 