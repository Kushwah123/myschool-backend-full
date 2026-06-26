import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { FaChalkboardTeacher, FaClipboardList, FaBookOpen, FaHome, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ onItemClick }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.includes(path);

  const handleNavClick = () => {
    if (onItemClick) onItemClick();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    navigate('/');
    if (onItemClick) onItemClick();
  };

  const navItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/teacher/attendance', label: 'Attendance', icon: <FaClipboardList />, checkPath: (loc) => isActive('/attendance') && !isActive('/attendance-report') },
    { path: '/teacher/attendance-report', label: 'Attendance Report', icon: '📈' },
    { path: '/teacher/complaints', label: 'Raise Complaint', icon: '📝' },
    { path: '/teacher/students', label: 'Student Directory', icon: <FaBookOpen /> },
    { path: '/teacher/marks', label: 'Marks', icon: <FaBookOpen /> },
    { path: '/teacher/homework', label: 'Homework', icon: '📚' },
  ];

  return (
    <div className="teacher-sidebar">
      <div className="sidebar-header">
        <FaChalkboardTeacher className="me-2" size={24} />
        <span className="sidebar-title">Teacher Panel</span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item, idx) => {
            const active = item.checkPath ? item.checkPath(location) : isActive(item.path);
            return (
              <li key={idx} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${active ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}

          <li className="nav-item">
            <Link
              to="/teacher/enquiry"
              className="nav-link"
              onClick={handleNavClick}
            >
              <span className="nav-icon">❓</span>
              <span className="nav-label">Enquiry</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-link logout-link"
          onClick={handleLogout}
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
