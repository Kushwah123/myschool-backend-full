import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminSidebar from '../pages/Admin/Sidebar';
import TeacherSidebar from '../pages/Teacher/Sidebar';
import ParentSidebar from '../pages/Parent/Sidebar';
import AccountantSidebar from '../pages/Accountant/Sidebar';
import { FaBars } from 'react-icons/fa';

const SidebarWrapper = () => {
  const [show, setShow] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => setShow(!show);

  const getSidebarByRole = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminSidebar />;
      case 'teacher':
        return <TeacherSidebar />;
      case 'parent':
        return <ParentSidebar />;
      case 'accountant':
        return <AccountantSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className="d-flex">
      {/* Toggle Button (for mobile) */}
      <div className="position-fixed p-2 bg-dark text-white d-md-none" style={{ zIndex: 1050, width: '100%' }}>
        <FaBars onClick={toggleSidebar} style={{ fontSize: '24px' }} />
      </div>

      {/* Sidebar Area */}
      <div
        className={`bg-dark text-white p-3 d-none d-md-block ${show ? 'd-block' : 'd-none'}`}
        style={{ width: '250px', minHeight: '100vh' }}
      >
        {getSidebarByRole()}
      </div>

      {/* Content Area */}
      <div className="flex-grow-1 p-3" style={{ marginTop: '50px' }}>
        {/* Place main routes/components here */}
      </div>
    </div>
  );
};

export default SidebarWrapper;
