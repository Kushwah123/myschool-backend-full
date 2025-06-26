// 📁 Admin/CreateClass.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClass } from '../../redux/slices/classSlice';
import { Form, Button, Container } from 'react-bootstrap';

const CreateClass = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', section: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createClass(formData));
  };

  return (
    <Container className="mt-4">
      <h4>Create New Class</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Class Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Section</Form.Label>
          <Form.Control name="section" onChange={handleChange} required />
        </Form.Group>

        <Button type="submit">Create</Button>
      </Form>
    </Container>
  );
};

export default CreateClass;