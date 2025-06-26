// src/pages/Admin/Dashboard.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { fetchParents } from '../../redux/slices/parentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { Card, Row, Col, Navbar, Container, Nav } from 'react-bootstrap';
import Sidebar from './Sidebar';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { students } = useSelector((state) => state.students);
  const { teachers } = useSelector((state) => state.teachers);
  const { parents } = useSelector((state) => state.parents);
  const { classes } = useSelector((state) => state.class);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
    dispatch(fetchParents());
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar with scroll */}
      <div style={{ width: '250px', overflowY: 'auto', height: '100vh' }}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow-1" style={{ overflowY: 'auto', height: '100vh' }}>
        {/* ✅ Navbar */}
        <Navbar bg="primary" variant="dark" expand="lg" className="px-4">
          <Navbar.Brand className="fw-bold">👨‍🏫 Welcome {user?.name || 'Mr. Admin'}</Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar" className="justify-content-end">
            <Nav>
              <Nav.Link href="/admin/profile" className="text-white">
                <FaUserCircle className="me-2" />
                Profile
              </Nav.Link>
              <Nav.Link className="text-white" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        {/* ✅ Dashboard Cards */}
        <Container fluid className="mt-4">
          <h2 className="mb-4">Admin Dashboard</h2>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="shadow-sm bg-light border-0">
                <Card.Body>
                  <Card.Title>Total Students</Card.Title>
                  <h3>{students?.length || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm bg-light border-0">
                <Card.Body>
                  <Card.Title>Total Teachers</Card.Title>
                  <h3>{teachers?.length || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm bg-light border-0">
                <Card.Body>
                  <Card.Title>Total Parents</Card.Title>
                  <h3>{parents?.length || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm bg-light border-0">
                <Card.Body>
                  <Card.Title>Total Classes</Card.Title>
                  <h3>{classes?.length || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
