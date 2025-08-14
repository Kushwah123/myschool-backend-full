import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onClose }) => (
  <div className="p-3">
    <button className="btn-close btn-close-white d-md-none mb-3" onClick={onClose}></button>
    <ul className="nav flex-column">
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
  </div>
);

export default Sidebar;
