import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, collectFee } from '../../redux/slices/feeSlice';
import { Button, Form, Card } from 'react-bootstrap';

const FeeCollection = () => {
  const dispatch = useDispatch();
  // const { students } = useSelector((state) => state.fee);
  const feeState = useSelector((state) => state.fee || { students: [] });
const { students } = feeState;

  const [formData, setFormData] = useState({ studentId: '', amount: '', date: '' });

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(collectFee(formData));
    setFormData({ studentId: '', amount: '', date: '' });
  };

  return (
    <div className="container mt-4">
      <Card className="p-4 shadow-sm">
        <h4>Collect Fee</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Student</Form.Label>
            <Form.Select value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}>
              <option>Select student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </Form.Group>

          <Button className="mt-3" type="submit">Collect</Button>
        </Form>
      </Card>
    </div>
  );
};

export default FeeCollection;
