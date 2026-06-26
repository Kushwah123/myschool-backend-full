import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <div className="p-3 d-flex flex-column" style={{ minHeight: '100vh' }}>
      <button className="btn-close btn-close-white d-md-none mb-3" onClick={onClose}></button>
      <ul className="nav flex-column mb-auto">
        <li className="nav-item">
          <Link to="/parent/dashboard" className="nav-link text-white">🏠 Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/parent/parent-child" className="nav-link text-white">👨‍👩‍👧 My Child</Link>
        </li>
        <li className="nav-item">
          <Link to="/parent/parent-fees" className="nav-link text-white">💳 Fees</Link>
        </li>
        <li className="nav-item">
          <Link to="/parent/parent-receipts" className="nav-link text-white">📄 Receipts</Link>
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
