import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Go to Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
