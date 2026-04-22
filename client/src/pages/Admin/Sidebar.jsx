import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState('');

  const toggleMenu = (menu) => {
    setOpenMenu(prev => (prev === menu ? '' : menu));
  };

  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '100%', maxWidth: '250px' }}>
      <h4 className="text-center text-warning fw-bold mb-3">🎓 Admin Panel</h4>
      <hr className="border-light" />

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <Link to="/admin/dashboard" className="nav-link text-white fw-semibold">
            🏠 Dashboard
          </Link>
        </li>

        {/* Students */}
        <li className="nav-item mb-2">
          <div onClick={() => toggleMenu('student')} className="nav-link text-white fw-semibold" role="button">
            👩‍🎓 Students
          </div>
          <Collapse in={openMenu === 'student'}>
            <ul className="nav flex-column ms-3 mt-1">
              <li className="nav-item">
                <Link to="/admin/add-student" className="nav-link text-white small">➕ Add Student</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/all-students" className="nav-link text-white small">📋 All Students</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/student-directory" className="nav-link text-white small">🔎 Student Directory</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/import-students" className="nav-link text-white small">📥 Import Students</Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Teachers */}
        <li className="nav-item mb-2">
          <div onClick={() => toggleMenu('teacher')} className="nav-link text-white fw-semibold" role="button">
            👨‍🏫 Teachers
          </div>
          <Collapse in={openMenu === 'teacher'}>
            <ul className="nav flex-column ms-3 mt-1">
              <li className="nav-item">
                <Link to="/admin/add-teacher" className="nav-link text-white small">➕ Add Teacher</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/all-teachers" className="nav-link text-white small">📋 All Teachers</Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Parents */}
        <li className="nav-item mb-2">
          <div onClick={() => toggleMenu('parent')} className="nav-link text-white fw-semibold" role="button">
            👪 Parents
          </div>
          <Collapse in={openMenu === 'parent'}>
            <ul className="nav flex-column ms-3 mt-1">
              <li className="nav-item">
                <Link to="/admin/add-parent" className="nav-link text-white small">➕ Add Parent</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/all-parents" className="nav-link text-white small">📋 All Parents</Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Class & Subjects */}
        <li className="nav-item mb-2">
          <div onClick={() => toggleMenu('class')} className="nav-link text-white fw-semibold" role="button">
            🏫 Class & Subjects
          </div>
          <Collapse in={openMenu === 'class'}>
            <ul className="nav flex-column ms-3 mt-1">
              <li className="nav-item">
                <Link to="/admin/create-class" className="nav-link text-white small">🏷️ Create Class</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/assign-class-teacher" className="nav-link text-white small">👩‍🏫 Assign Class Teacher</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/assign-subject" className="nav-link text-white small">📚 Assign Subject</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/subject" className="nav-link text-white small">➕ Add Subject</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/add-chapter" className="nav-link text-white small">📖 Add Chapter</Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* Fee Management */}
        <li className="nav-item mb-2">
          <div onClick={() => toggleMenu('fee')} className="nav-link text-white fw-semibold" role="button">
            💰 Fee Management
          </div>
          <Collapse in={openMenu === 'fee'}>
            <ul className="nav flex-column ms-3 mt-1">
              <li className="nav-item">
                <Link to="/admin/fee-structure" className="nav-link text-white small">💼 Fee Structure</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/assign-fee" className="nav-link text-white small">🧾 Assign Fee</Link>
              </li>
                <li className="nav-item">
                <Link to="/admin/fee-History" className="nav-link text-white small">Fee History</Link>
              </li>
            </ul>
          </Collapse>
        </li>

        <hr className="border-light my-3" />

        <li className="nav-item mb-2">
          <Link to="/admin/staff-registration" className="nav-link text-white fw-semibold">🧑‍💼 Staff Registration</Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/admin/homework" className="nav-link text-white fw-semibold">📚 Homework Management</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/whatsapp-settings" className="nav-link text-white fw-semibold">📱 WhatsApp Setup</Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/admin/simple-qr-test" className="nav-link text-white fw-semibold">🧪 QR Test</Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/admin/qr-login" className="nav-link text-white fw-semibold">🔐 QR Login</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/attendance-report" className="nav-link text-white fw-semibold">📈 Attendance Report</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/complaints" className="nav-link text-white fw-semibold">🧾 Complaints</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/reports" className="nav-link text-white fw-semibold">📊 Reports</Link>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
