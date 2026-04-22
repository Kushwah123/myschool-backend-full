// 📁 Admin/AssignSubject.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axiosInstance';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

const AssignSubject = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const { teachers } = useSelector((state) => state.teachers);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({ subjectId: '', classId: '', teacherId: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());

    axios.get('/subjects')
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, [dispatch]);

  const subjectsForClass = useMemo(() => {
    return subjects.filter((subject) => {
      if (!formData.classId) return false;
      const classIdValue = subject.classId?._id || subject.classId;
      return classIdValue && classIdValue.toString() === formData.classId.toString();
    });
  }, [formData.classId, subjects]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFeedback({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      await axios.post('/teachers/assign-subject', formData);
      setFeedback({ type: 'success', message: 'Subject assigned to teacher successfully.' });
      setFormData({ subjectId: '', classId: '', teacherId: '' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Unable to assign subject to teacher.'
      });
    }

    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h4>Assign Subject to Teacher</h4>
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
          <Form.Label>Subject</Form.Label>
          <Form.Select name="subjectId" value={formData.subjectId} onChange={handleChange} required>
            <option value="">Select subject</option>
            {subjectsForClass.map((subject) => (
              <option key={subject._id} value={subject._id}>{subject.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
            <option value="">Select teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Assign Subject'}
        </Button>
      </Form>
    </Container>
  );
};

export default AssignSubject;