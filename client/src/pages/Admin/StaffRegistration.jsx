import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from '../../axiosInstance';
import { toast } from 'react-toastify';

const StaffRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) return toast.warning("Please select a role");

    try {
      const res = await axios.post('/auth/signup', formData);
      toast.success(`${formData.role.toUpperCase()} registered successfully`);
      setFormData({ name: '', email: '', password: '', mobile: '', role: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h4 className="text-center mb-4">🔐 Role-Based User Registration</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile</Form.Label>
                <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} maxLength="10" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email (optional for teacher)</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="accountant">Accountant</option>
            </Form.Select>
          </Form.Group>

          <div className="text-center">
            <Button type="submit" variant="primary">Register</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default StaffRegistration;
