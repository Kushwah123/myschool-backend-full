import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

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
    <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand className="fw-bold">
          🎓 {getRoleTitle(user?.role)} Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="role-navbar" />
        <Navbar.Collapse id="role-navbar" className="justify-content-end">
          <Nav>
            <span className="navbar-text text-white me-3 fw-semibold">
              {user?.name || 'User'}
            </span>
            <Nav.Link onClick={handleLogout} className="text-white">
              🔒 Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
