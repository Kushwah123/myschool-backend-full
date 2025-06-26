import React from 'react';
import { useSelector } from 'react-redux';
import TeacherSidebar from './TeacherSidebar';
import { Navbar, Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="d-flex">
      {/* 📌 Sidebar (Left) */}
      <TeacherSidebar />

      {/* 📌 Main Content (Right) */}
      <div className="flex-grow-1">
        {/* 🔹 Top Navbar */}
        <Navbar bg="primary" variant="dark" className="px-4">
          <Navbar.Brand className="fw-bold">Welcome, {user?.name || 'Teacher'}</Navbar.Brand>
        </Navbar>

        {/* 🔹 Page Content */}
        <Container fluid className="mt-4">
          <Row>
            <Col>
              <h3 className="mb-3">📋 Teacher Dashboard</h3>
              <p>Use the sidebar to manage attendance, marks, and homework.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
