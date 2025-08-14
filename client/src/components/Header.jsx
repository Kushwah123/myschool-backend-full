import React from 'react';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
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
        <Row className="w-100 align-items-center">
          <Col xs={6}>
            <Navbar.Brand className="fw-bold">
              🎓 {getRoleTitle(user?.role)} Panel
            </Navbar.Brand>
          </Col>
          <Col xs={6} className="text-end">
            <span className="text-white me-3 fw-semibold">
              {user?.name || 'User'}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              🔒 Logout
            </button>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
