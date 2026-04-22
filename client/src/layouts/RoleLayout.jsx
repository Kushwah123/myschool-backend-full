import React, { useState, useEffect } from 'react';
import './RoleLayout.css';
import { Button } from 'react-bootstrap';

const RoleLayout = ({ Sidebar, Header, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar-wrapper');
        const toggleBtn = document.querySelector('.toggle-btn');
        if (sidebar && sidebar.classList.contains('open') && 
            !sidebar.contains(event.target) && 
            !toggleBtn.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
