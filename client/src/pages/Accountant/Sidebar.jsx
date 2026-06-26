import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaFileInvoice,
  FaUserPlus,
  FaUsers,
  FaBookOpen,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="d-flex flex-column bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h5 className="text-center mb-4">💼 Accountant Panel</h5>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link
            to="/accountant/dashboard"
            className={`nav-link ${isActive('/accountant/dashboard') ? 'active' : 'text-white'}`}
          >
            🏠 Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/accountant/collect-fee"
            className={`nav-link ${isActive('/accountant/collect-fee') ? 'active' : 'text-white'}`}
          >
            <FaMoneyBillWave className="me-2" />
            Collect Fees
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/accountant/receipts"
            className={`nav-link ${isActive('/accountant/receipts') ? 'active' : 'text-white'}`}
          >
            <FaFileInvoice className="me-2" />
            Receipts
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/accountant/reports"
            className={`nav-link ${isActive('/accountant/reports') ? 'active' : 'text-white'}`}
          >
            <FaClipboardList className="me-2" />
            Reports
          </Link>
        </li>

        <hr className="text-white" />

        <li className="nav-item mb-2">
          <Link
            to="/accountant/add-student"
            className={`nav-link ${isActive('/accountant/add-student') ? 'active' : 'text-white'}`}
          >
            <FaUserPlus className="me-2" />
            Add Student
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/accountant/add-parent"
            className={`nav-link ${isActive('/accountant/add-parent') ? 'active' : 'text-white'}`}
          >
            <FaUserPlus className="me-2" />
            Add Parent
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/accountant/all-students"
            className={`nav-link ${isActive('/accountant/all-students') ? 'active' : 'text-white'}`}
          >
            <FaUsers className="me-2" />
            All Students
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            to="/accountant/fee-structure"
            className={`nav-link ${isActive('/accountant/fee-structure') ? 'active' : 'text-white'}`}
          >
            <FaBookOpen className="me-2" />
            Fee Structure
          </Link>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="btn btn-outline-danger w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 mt-3"
      >
        <FaSignOutAlt size={16} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
