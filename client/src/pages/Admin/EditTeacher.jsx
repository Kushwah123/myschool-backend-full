import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateTeacher, fetchTeachers, fetchTeacherById } from '../../redux/slices/teacherSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditTeacher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { teachers, loading } = useSelector((state) => state.teachers);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    qualification: '',
    subjectSpecialization: '',
    gender: '',
    dob: '',
    address: '',
    experience: 0,
  });

  useEffect(() => {
    dispatch(fetchTeacherById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const teacher = teachers.find(t => t._id === id);
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        mobile: teacher.mobile || '',
        qualification: teacher.qualification || '',
        subjectSpecialization: teacher.subjectSpecialization || '',
        gender: teacher.gender || '',
        dob: teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : '',
        address: teacher.address || '',
        experience: teacher.experience || 0,
      });
    }
  }, [teachers, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTeacher({ id, teacherData: formData })).unwrap();
      toast.success('✅ Teacher updated successfully!');
      navigate('/all-teachers');
    } catch (err) {
      toast.error(err.message || '❌ Failed to update teacher');
    }
  };

  const teacher = teachers.find(t => t._id === id);

  if (loading && !teacher) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading teacher data...</p>
        </div>
      </Container>
    );
  }

  if (!teacher) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <p>Teacher not found</p>
          <Button variant="secondary" onClick={() => navigate('/all-teachers')}>
            Back to Teachers
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0">
        <h3 className="mb-4 text-center">👨‍🏫 Edit Teacher</h3>
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
                <Form.Label>Mobile *</Form.Label>
                <Form.Control name="mobile" maxLength="10" value={formData.mobile} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Experience (years)</Form.Label>
                <Form.Control type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" />
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
            <Button type="submit" disabled={loading} className="me-2">
              {loading ? <Spinner animation="border" size="sm" /> : 'Update Teacher'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/all-teachers')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditTeacher;