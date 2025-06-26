// src/pages/Admin/FeeStructure.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../redux/slices/classSlice';
import { createFeeStructure } from '../../redux/slices/feeSlice';
import { Form, Button, Container, Card } from 'react-bootstrap';

const FeeStructure = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);

  const [formData, setFormData] = useState({
    classId: '',
    planType: 'Monthly',
    amount: ''
  });

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createFeeStructure(formData));
    setFormData({ classId: '', planType: 'Monthly', amount: '' });
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">Create Fee Structure</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Class</Form.Label>
            <Form.Select name="classId" value={formData.classId} onChange={handleChange} required>
              <option value="">-- Select Class --</option>
              {classes?.map((cls) => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fee Plan</Form.Label>
            <Form.Select name="planType" value={formData.planType} onChange={handleChange}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Custom">Custom</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount (₹)</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit">Create</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default FeeStructure;
