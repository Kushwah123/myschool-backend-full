import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EnquiryForm = () => {
  const [form, setForm] = useState({
    parentName: '',
    mobile: '',
    email: '',
    address: '',
    children: [{ name: '', dob: '', className: '', gender: '' }],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChildChange = (index, e) => {
    const updatedChildren = [...form.children];
    updatedChildren[index][e.target.name] = e.target.value;
    setForm({ ...form, children: updatedChildren });
  };

  const addChild = () => {
    setForm({
      ...form,
      children: [...form.children, { name: '', dob: '', className: '', gender: '' }],
    });
  };

  const removeChild = (index) => {
    const updatedChildren = [...form.children];
    updatedChildren.splice(index, 1);
    setForm({ ...form, children: updatedChildren });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/enquiries', form);
      toast.success('Enquiry submitted successfully!');
      setForm({
        parentName: '',
        mobile: '',
        email: '',
        address: '',
        children: [{ name: '', dob: '', className: '', gender: '' }],
        
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow">
        <h4>Parent Enquiry Form</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Parent Name</Form.Label>
                <Form.Control name="parentName" value={form.parentName} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile</Form.Label>
                <Form.Control name="mobile" value={form.mobile} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" value={form.address} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h5>Child Details</h5>
          {form.children.map((child, index) => (
            <Row className="mb-3" key={index}>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Child Name</Form.Label>
                  <Form.Control name="name" value={child.name} onChange={(e) => handleChildChange(index, e)} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>DOB</Form.Label>
                  <Form.Control type="date" name="dob" value={child.dob} onChange={(e) => handleChildChange(index, e)} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Class</Form.Label>
                  <Form.Control name="className" value={child.className} onChange={(e) => handleChildChange(index, e)} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={child.gender} onChange={(e) => handleChildChange(index, e)}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                {index > 0 && (
                  <Button variant="danger" onClick={() => removeChild(index)}>X</Button>
                )}
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={addChild} className="mb-3">+ Add Another Child</Button>

          <div className="text-center">
            <Button type="submit">Submit Enquiry</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EnquiryForm;
