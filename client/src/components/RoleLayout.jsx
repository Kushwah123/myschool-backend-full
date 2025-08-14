import React, { useState } from 'react';
import './RoleLayout.css';
import { Button } from 'react-bootstrap';

const RoleLayout = ({ Sidebar, Header, children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Mobile Toggle Button */}
        <Button
          variant="primary"
          className="toggle-btn d-md-none"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </Button>

        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default RoleLayout;
