// src/pages/Admin/AssignFee.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchFeeStructures, assignFee } from '../../redux/slices/feeSlice';
import { Form, Button, Container, Card } from 'react-bootstrap';

const AssignFee = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { feeStructures } = useSelector((state) => state.fees);

  const [formData, setFormData] = useState({
    studentId: '',
    feeStructureId: '',
  });

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchFeeStructures());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assignFee(formData));
    setFormData({ studentId: '', feeStructureId: '' });
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">Assign Fee to Student</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Student</Form.Label>
            <Form.Select name="studentId" value={formData.studentId} onChange={handleChange} required>
              <option value="">-- Select Student --</option>
              {students?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fee Structure</Form.Label>
            <Form.Select name="feeStructureId" value={formData.feeStructureId} onChange={handleChange} required>
              <option value="">-- Select Fee Plan --</option>
              {feeStructures?.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.planType} - ₹{f.amount}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit">Assign Fee</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AssignFee;
