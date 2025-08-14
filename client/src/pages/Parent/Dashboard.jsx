// src/pages/parent/ParentDashboard.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Sidebar from './Sidebar'; // Sidebar placed on left

const Dashboard = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar */}
       

        {/* Main Dashboard */}
        <Col xs={12} md={9}>
          <h3 className="mb-4 text-primary fw-bold">👨‍👩‍👧 Welcome to Parent Dashboard</h3>

          <Row className="g-4">
            <Col xs={12} sm={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 p-3">
                <Card.Body className="text-center">
                  <h5 className="text-secondary">📚 View Child Details</h5>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 p-3">
                <Card.Body className="text-center">
                  <h5 className="text-secondary">💰 Fee Payment History</h5>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <Card className="shadow-sm border-0 h-100 p-3">
                <Card.Body className="text-center">
                  <h5 className="text-secondary">📄 Download Receipts</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
