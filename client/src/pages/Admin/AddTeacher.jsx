import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { registerTeacher } from '../../redux/slices/teacherSlice';
import { toast } from 'react-toastify';

const AddTeacher = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.teachers);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    qualification: '',
    subjectSpecialization: '',
    gender: '',
    dob: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerTeacher(formData)).unwrap();
      toast.success('✅ Teacher registered successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        mobile: '',
        qualification: '',
        subjectSpecialization: '',
        gender: '',
        dob: '',
        address: '',
      });
    } catch (err) {
      toast.error(err.message || '❌ Failed to register teacher');
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0">
        <h3 className="mb-4 text-center">👨‍🏫 Add Teacher</h3>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name *</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password *</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile *</Form.Label>
                <Form.Control name="mobile" maxLength="10" value={formData.mobile} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Qualification</Form.Label>
                <Form.Control name="qualification" value={formData.qualification} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Subject Specialization</Form.Label>
                <Form.Control name="subjectSpecialization" value={formData.subjectSpecialization} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" value={formData.address} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Register Teacher'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddTeacher;
