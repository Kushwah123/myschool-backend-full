// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // default close on mobile

  return (
    <div className="admin-layout">
      <AdminHeader onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="d-flex">
        <div className={`admin-sidebar ${sidebarOpen ? 'show-sidebar' : 'hide-sidebar'}`}>
          <Sidebar />
        </div>

        <div className="admin-content p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
