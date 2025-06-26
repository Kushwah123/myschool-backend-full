import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchFeeStructures, assignFee } from '../../redux/slices/feeSlice';
import { Form, Button, Spinner } from 'react-bootstrap';

const AssignFee = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    classId: '',
    studentId: '',
    feeStructureId: '',
  });

  const { classes } = useSelector((state) => state.class);
  const { students } = useSelector((state) => state.student);
  const { feeStructures, loading } = useSelector((state) => state.fee);

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
    dispatch(fetchFeeStructures());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(assignFee(formData));
    // dispatch(assignFee({ studentId, feeStructureId, amount }));

  };

  return (
    <div className="container mt-4">
      <h3>Assign Fee to Student</h3>
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group controlId="classId">
          <Form.Label>Class</Form.Label>
          <Form.Select name="classId" value={formData.classId} onChange={handleChange} required>
            <option value=''>Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} {cls.section}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="studentId" className="mt-3">
          <Form.Label>Student</Form.Label>
          <Form.Select name="studentId" value={formData.studentId} onChange={handleChange} required>
            <option value=''>Select Student</option>
            {students
              .filter((stu) => stu.classId?._id === formData.classId)
              .map((stu) => (
                <option key={stu._id} value={stu._id}>
                  {stu.fullName}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="feeStructureId" className="mt-3">
          <Form.Label>Fee Structure</Form.Label>
          <Form.Select name="feeStructureId" value={formData.feeStructureId} onChange={handleChange} required>
            <option value=''>Select Fee Structure</option>
            {feeStructures.map((fee) => (
              <option key={fee._id} value={fee._id}>
                {fee.feeTitle} - ₹{fee.amount}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Assign Fee'}
        </Button>
      </Form>
    </div>
  );
};

export default AssignFee;