// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="text-center mt-5">
    <h2>🚫 Access Denied</h2>
    <p>You are not authorized to view this page.</p>
    <Link to="/">Go to Login</Link>
  </div>
);

export default Unauthorized;
