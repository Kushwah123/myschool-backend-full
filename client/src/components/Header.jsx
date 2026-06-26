import React from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'teacher':
        return 'Teacher';
      case 'student':
        return 'Student';
      case 'parent':
        return 'Parent';
      case 'accountant':
        return 'Accountant';
      default:
        return '';
    }
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" className="navbar-header px-3 shadow-sm">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col xs={6} md={8}>
            <Navbar.Brand className="navbar-brand-title fw-bold">
              🎓 {getRoleTitle(user?.role)} Panel
            </Navbar.Brand>
          </Col>
          <Col xs={6} md={4} className="text-end">
            <div className="user-section d-flex align-items-center justify-content-end gap-3">
              <div className="user-info">
                <div className="user-avatar">
                  <FaUser size={16} />
                </div>
              </div>
              <div className="user-details">
                <div className="user-name fw-semibold text-dark">
                  {user?.name || 'User'}
                </div>
                <div className="user-role text-muted small">
                  {getRoleTitle(user?.role)}
                </div>
              </div>
              <button
                className="btn btn-logout"
                onClick={handleLogout}
                title="Logout"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
