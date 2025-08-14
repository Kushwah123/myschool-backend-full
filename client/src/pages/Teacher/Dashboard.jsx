import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Navbar, Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="d-flex">
      {/* 📌 Sidebar (Left) */}
      

      {/* 📌 Main Content (Right) */}


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
    
  );
};

export default Dashboard;
