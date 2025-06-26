import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parentLogin } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Container, Form, Button, Card } from 'react-bootstrap';

const ParentLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(parentLogin({ email, password }));
  };

  useEffect(() => {
    if (userInfo && userInfo.role === 'parent') {
      navigate('/parent/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ maxWidth: '400px', width: '100%' }} className="p-4 shadow">
        <h3 className="text-center mb-4">Parent Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter parent email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ParentLogin;
