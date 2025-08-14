import React, { useState } from 'react';
import './RoleLayout.css';
import { Button } from 'react-bootstrap';

const RoleLayout = ({ Sidebar, Header, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="layout-container">
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>

      <div className="main-content">
        {/* Mobile Toggle Button */}
        <Button
          variant="light"
          className="toggle-btn d-md-none"
          onClick={toggleSidebar}
        >
          ☰
        </Button>

        {/* Header (can contain logo or title) */}
        <Header />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RoleLayout;
