import React from 'react';
import { Link } from 'react-router-dom';

const TeacherSidebar = () => {
  return (
    <div>
      <h5>Teacher Panel</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/teacher/dashboard" className="nav-link text-white">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/teacher/attendance" className="nav-link text-white">Attendance</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/teacher/marks" className="nav-link text-white">Marks</Link>
        </li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;
