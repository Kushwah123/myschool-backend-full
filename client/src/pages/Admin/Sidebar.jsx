// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState('');

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? '' : menu));
  };

  return (
    <div className="sidebar bg-dark text-white p-3" style={{ width: '250px', height: '100vh', position: 'fixed', overflow: 'hidden' }}>
      <h4 className="text-center">🎓 Admin Panel</h4>
      <hr className="border-light" />

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link text-white fw-bold">🏠 Dashboard</Link>
        </li>

        {/* 👩‍🎓 Students */}
        <li className="nav-item">
          <div onClick={() => toggleMenu('student')} className="nav-link text-white fw-bold" style={{ cursor: 'pointer' }}>👩‍🎓 Students</div>
          <Collapse in={openMenu === 'student'}>
            <ul className="list-unstyled ps-3">
              <li><Link to="/admin/add-student" className="nav-link text-white">➕ Add Student</Link></li>
              <li><Link to="/admin/all-students" className="nav-link text-white">📋 All Students</Link></li>
            </ul>
          </Collapse>
        </li>

        {/* 👨‍🏫 Teachers */}
        <li className="nav-item">
          <div onClick={() => toggleMenu('teacher')} className="nav-link text-white fw-bold" style={{ cursor: 'pointer' }}>👨‍🏫 Teachers</div>
          <Collapse in={openMenu === 'teacher'}>
            <ul className="list-unstyled ps-3">
              <li><Link to="/admin/add-teacher" className="nav-link text-white">➕ Add Teacher</Link></li>
              <li><Link to="/admin/all-teachers" className="nav-link text-white">📋 All Teachers</Link></li>
            </ul>
          </Collapse>
        </li>

        {/* 👪 Parents */}
        <li className="nav-item">
          <div onClick={() => toggleMenu('parent')} className="nav-link text-white fw-bold" style={{ cursor: 'pointer' }}>👪 Parents</div>
          <Collapse in={openMenu === 'parent'}>
            <ul className="list-unstyled ps-3">
              <li><Link to="/admin/add-parent" className="nav-link text-white">➕ Add Parent</Link></li>
              <li><Link to="/admin/all-parents" className="nav-link text-white">📋 All Parents</Link></li>
            </ul>
          </Collapse>
        </li>

        {/* 🏫 Class & Subject */}
        <li className="nav-item">
          <div onClick={() => toggleMenu('class')} className="nav-link text-white fw-bold" style={{ cursor: 'pointer' }}>🏫 Class & Subjects</div>
          <Collapse in={openMenu === 'class'}>
            <ul className="list-unstyled ps-3">
              <li><Link to="/admin/create-class" className="nav-link text-white">🏷️ Create Class</Link></li>
              <li><Link to="/admin/assign-subject" className="nav-link text-white">📚 Assign Subject</Link></li>
            </ul>
          </Collapse>
        </li>

        {/* 💰 Fees */}
        <li className="nav-item">
          <div onClick={() => toggleMenu('fee')} className="nav-link text-white fw-bold" style={{ cursor: 'pointer' }}>💰 Fee Management</div>
          <Collapse in={openMenu === 'fee'}>
            <ul className="list-unstyled ps-3">
              <li><Link to="/admin/fee-structure" className="nav-link text-white">💼 Fee Structure</Link></li>
              <li><Link to="/admin/assign-fee" className="nav-link text-white">🧾 Assign Fee</Link></li>
            </ul>
          </Collapse>
        </li>

        {/* 📊 Reports */}
        <li className="nav-item">
          <Link to="/admin/staff-registration" className="nav-link text-white fw-bold">📊 StaffRegistration</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/reports" className="nav-link text-white fw-bold">📊 Reports</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
