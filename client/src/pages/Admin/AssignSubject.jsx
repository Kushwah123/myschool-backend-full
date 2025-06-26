// 📁 Admin/AssignSubject.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignSubject } from '../../redux/slices/subjectSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { Form, Button, Container } from 'react-bootstrap';

const AssignSubject = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const { teachers } = useSelector((state) => state.teachers);

  const [formData, setFormData] = useState({
    subjectName: '',
    classId: '',
    teacherId: '',
  });

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assignSubject(formData));
  };

  return (
    <Container className="mt-4">
      <h4>Assign Subject</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Subject Name</Form.Label>
          <Form.Control name="subjectName" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Class</Form.Label>
          <Form.Select name="classId" onChange={handleChange} required>
            <option value="">Select</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select name="teacherId" onChange={handleChange} required>
            <option value="">Select</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit">Assign</Button>
      </Form>
    </Container>
  );
};

export default AssignSubject;