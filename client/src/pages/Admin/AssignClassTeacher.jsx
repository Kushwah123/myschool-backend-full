import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axiosInstance';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const AssignClassTeacher = () => {
  const dispatch = useDispatch();
  const { classes, loading: classLoading } = useSelector((state) => state.class);
  const { teachers, status: teacherStatus } = useSelector((state) => state.teachers);

  const [formData, setFormData] = useState({ classId: '', teacherId: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      await axios.put('/classes/assign-teacher', formData);
      setFeedback({ type: 'success', message: 'Class teacher assigned successfully.' });
      setFormData({ classId: '', teacherId: '' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.error || err.response?.data?.message || 'Failed to assign class teacher.'
      });
    }

    setSubmitting(false);
  };

  return (
    <Container className="mt-4">
      <h4>Assign Class Teacher</h4>
      {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}
      <Form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <Form.Group className="mb-3">
          <Form.Label>Class</Form.Label>
          <Form.Select name="classId" value={formData.classId} onChange={handleChange} required>
            <option value="">Select class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{`${cls.name} ${cls.section || ''}`}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
            <option value="">Select teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" disabled={submitting || classLoading || teacherStatus === 'loading'}>
          {submitting ? <Spinner animation="border" size="sm" /> : 'Assign Teacher'}
        </Button>
      </Form>
    </Container>
  );
};

export default AssignClassTeacher;
