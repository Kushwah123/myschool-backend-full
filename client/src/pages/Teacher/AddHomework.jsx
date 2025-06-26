// 📄 AddHomework.jsx (Teacher Panel)
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createHomework, fetchClasses, fetchSubjects } from '../../redux/slices/homeworkSlice';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddHomework = () => {
  const dispatch = useDispatch();
  const { classes, subjects } = useSelector(state => state.homework);
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(createHomework(formData));
  };

  return (
    <Container className="mt-4">
      <h4>📘 Assign Homework</h4>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="classId">
              <Form.Label>Class</Form.Label>
              <Form.Select name="classId" onChange={handleChange} value={formData.classId}>
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="subjectId">
              <Form.Label>Subject</Form.Label>
              <Form.Select name="subjectId" onChange={handleChange} value={formData.subjectId}>
                <option value="">Select Subject</option>
                {subjects.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mt-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-3" controlId="dueDate">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </Form.Group>

        <Button className="mt-4" type="submit">Assign Homework</Button>
      </Form>
    </Container>
  );
};

export default AddHomework;
