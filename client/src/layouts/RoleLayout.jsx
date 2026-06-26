import React, { useState, useEffect } from 'react';
import './RoleLayout.css';
import { FiMenu, FiX } from 'react-icons/fi';

const RoleLayout = ({ Sidebar, Header, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('.sidebar-wrapper');
        const toggleBtn = document.querySelector('.toggle-btn');
        const backdrop = document.querySelector('.sidebar-backdrop');
        
        if (
          (sidebar && !sidebar.contains(event.target)) &&
          (toggleBtn && !toggleBtn.contains(event.target)) &&
          (backdrop && !backdrop.contains(event.target))
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Close sidebar when route changes
  useEffect(() => {
    return () => {
      if (isMobile) {
        setSidebarOpen(false);
      }
    };
  }, [isMobile]);

  return (
    <div className="layout-container">
      {/* Sidebar Backdrop for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="sidebar-backdrop" 
          onClick={closeSidebar}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
        />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onItemClick={closeSidebar} />
      </div>

      <div className="main-content">
        {/* Header (can contain logo or title) */}
        <Header />

        {/* Mobile Toggle Button */}
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          aria-expanded={sidebarOpen}
          title={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RoleLayout;
