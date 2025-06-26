  import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChalkboardTeacher, FaClipboardList, FaBookOpen, FaHome, FaSignOutAlt } from 'react-icons/fa';

const TeacherSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="bg-dark text-white vh-100" style={{ width: '250px' }}>
      <div className="text-center py-4 border-bottom border-secondary">
        <h5><FaChalkboardTeacher className="me-2" />Teacher Panel</h5>
      </div>

      <div className="p-3">
        <ul className="nav flex-column gap-2">
          <li className="nav-item">
            <Link
              to="/teacher/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'bg-primary text-white' : 'text-light'}`}
            >
              <FaHome className="me-2" />Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/teacher/attendance"
              className={`nav-link ${isActive('/attendance') ? 'bg-primary text-white' : 'text-light'}`}
            >
              <FaClipboardList className="me-2" />Attendance
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/teacher/marks"
              className={`nav-link ${isActive('/marks') ? 'bg-primary text-white' : 'text-light'}`}
            >
              <FaBookOpen className="me-2" />Marks
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/teacher/homework"
              className={`nav-link ${isActive('/homework') ? 'bg-primary text-white' : 'text-light'}`}
            >
              📚 Homework
            </Link>
          </li>
          <li className="nav-item mb-2">
                    <Link to="/teacher/enquiry" className="nav-link text-white">Add enquiry</Link>
                  </li>
          <li className="nav-item mt-3">
            <Link
              to="/"
              className="nav-link text-danger"
            >
              <FaSignOutAlt className="me-2" />Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherSidebar;
