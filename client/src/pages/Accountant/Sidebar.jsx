import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoneyBillWave, FaClipboardList, FaFileInvoice, FaSignOutAlt } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="text-white p-3 sidebar" style={{ minHeight: '100vh' }}>
      <h5 className="text-center mb-4">💼 Accountant</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/accountant/dashboard" className={`nav-link ${isActive('/dashboard') ? 'text-warning' : 'text-white'}`}>
            🏠 Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/collect-fee" className={`nav-link ${isActive('/collect-fee') ? 'text-warning' : 'text-white'}`}>
            <FaMoneyBillWave className="me-2" /> Collect Fees
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/receipts" className={`nav-link ${isActive('/receipts') ? 'text-warning' : 'text-white'}`}>
            <FaFileInvoice className="me-2" /> Receipts
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/reports" className={`nav-link ${isActive('/reports') ? 'text-warning' : 'text-white'}`}>
            <FaClipboardList className="me-2" /> Reports
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/add-student" className={`nav-link ${isActive('/reports') ? 'text-warning' : 'text-white'}`}>
            <FaClipboardList className="me-2" /> add-student
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/add-parent" className={`nav-link ${isActive('/reports') ? 'text-warning' : 'text-white'}`}>
            <FaClipboardList className="me-2" /> add-parent
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/all-students" className={`nav-link ${isActive('/reports') ? 'text-warning' : 'text-white'}`}>
            <FaClipboardList className="me-2" /> all-students
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/accountant/fee-structure" className={`nav-link ${isActive('/reports') ? 'text-warning' : 'text-white'}`}>
            <FaClipboardList className="me-2" /> fee-structure
          </Link>
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
