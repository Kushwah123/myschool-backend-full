import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import { fetchClasses } from '../../redux/slices/classSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

const AddChapter = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({ subjectId: '', name: '', maxMarks: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    setFetching(true);
    axios.get('/subjects')
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err))
      .finally(() => setFetching(false));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      await axios.post('/chapters/add', {
        subjectId: formData.subjectId,
        name: formData.name,
        maxMarks: Number(formData.maxMarks),
      });
      setFeedback({ type: 'success', message: 'Chapter added successfully.' });
      setFormData({ subjectId: '', name: '', maxMarks: '' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.error || err.response?.data?.message || 'Failed to add chapter.'
      });
    }

    setLoading(false);
  };

  return (
    <Container className="mt-4">
      <h4>Add Chapter</h4>
      {feedback.message && <Alert variant={feedback.type}>{feedback.message}</Alert>}
      <Form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Select name="subjectId" value={formData.subjectId} onChange={handleChange} required>
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>{subject.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Chapter Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Max Marks</Form.Label>
          <Form.Control
            type="number"
            name="maxMarks"
            value={formData.maxMarks}
            onChange={handleChange}
            required
            min="1"
          />
        </Form.Group>

        <Button type="submit" disabled={loading || fetching}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Add Chapter'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddChapter;
