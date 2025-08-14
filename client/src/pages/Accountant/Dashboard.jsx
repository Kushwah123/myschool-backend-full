// AccountantDashboard.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4 text-primary fw-bold">Welcome, {user?.name || 'Accountant'}</h3>

      <Row className="g-4">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body>
              <Card.Title className="text-muted">💰 Total Fees Collected</Card.Title>
              <h2 className="text-success">₹ 1,25,000</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body>
              <Card.Title className="text-muted">📅 Pending Installments</Card.Title>
              <h2 className="text-warning">₹ 28,000</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Card className="shadow border-0 h-100">
            <Card.Body>
              <Card.Title className="text-muted">📦 Total Students Billed</Card.Title>
              <h2 className="text-info">420</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr className="my-5" />

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-4 fw-semibold text-secondary">💼 Quick Actions</h5>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Button variant="primary" className="w-100">Collect Fees</Button>
            </Col>
            <Col xs={12} md={4}>
              <Button variant="outline-secondary" className="w-100">Generate PDF Receipt</Button>
            </Col>
            <Col xs={12} md={4}>
              <Button variant="success" className="w-100">Send SMS Notification</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;