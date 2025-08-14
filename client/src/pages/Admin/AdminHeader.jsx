import React from 'react';

const AdminHeader = () => {
  return (
    <header className="admin-header d-flex justify-content-between align-items-center px-3 py-2 bg-light shadow-sm">
      <h5 className="m-0 fw-bold text-primary">🎓 Admin Panel</h5>

      {/* Future: Right Side - User profile / Logout */}
      <div>
        {/* Placeholder icons or buttons */}
        <span className="me-3 text-secondary d-none d-md-inline">Welcome, Admin</span>
        <button className="btn btn-outline-secondary btn-sm">Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
