// src/pages/Admin/AdminProfile.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import Sidebar from './Sidebar';

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth); // redux से auth user details

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container mt-4">
        <h2 className="mb-4">Admin Profile</h2>
        <Card className="shadow-sm p-4">
          <h5><strong>👤 Name:</strong> {user?.name || 'N/A'}</h5>
          <h5><strong>📧 Email:</strong> {user?.email || 'N/A'}</h5>
          <h5><strong>🛡️ Role:</strong> {user?.role || 'Admin'}</h5>
          <h5><strong>📅 Joined:</strong> {new Date(user?.createdAt).toLocaleDateString() || 'N/A'}</h5>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
