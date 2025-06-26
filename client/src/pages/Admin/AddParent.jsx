import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { createParent } from "../../redux/slices/parentSlice";
import { fetchStudents } from "../../redux/slices/studentSlice";
import { fetchClasses } from "../../redux/slices/classSlice";
import { toast } from "react-toastify";

const AddParent = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { classes } = useSelector((state) => state.class);

  const [form, setForm] = useState({
    fullName: "", mobile: "", email: "", address: "", password: "", studentIds: []
  });

  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
  }, [dispatch]);

  // Filter students of selected class
  const filteredStudents = students.filter((s) => s.classId?._id === selectedClassId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const selected = options.map((opt) => opt.value);
    setForm((prev) => ({ ...prev, studentIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password) return toast.error("Password is required");
    if (form.studentIds.length === 0) return toast.error("Select at least one student");

    try {
      await dispatch(createParent(form)).unwrap();
      toast.success("Parent registered successfully!");
      setForm({
        fullName: "", mobile: "", email: "", address: "", password: "", studentIds: []
      });
    } catch (err) {
      toast.error(err.message || "Failed to register parent");
    }
  };

  return (
    <Container className="my-4">
      <Card className="p-4 shadow">
        <h4 className="mb-3">👨‍👩‍👧 Parent Registration</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}><Form.Group><Form.Label>Full Name</Form.Label>
              <Form.Control name="fullName" onChange={handleChange} value={form.fullName} required /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Mobile</Form.Label>
              <Form.Control name="mobile" maxLength="10" onChange={handleChange} value={form.mobile} required /></Form.Group></Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}><Form.Group><Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} value={form.email} /></Form.Group></Col>
            <Col md={6}><Form.Group><Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} value={form.password} required /></Form.Group></Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}><Form.Group><Form.Label>Address</Form.Label>
              <Form.Control as="textarea" name="address" onChange={handleChange} value={form.address} /></Form.Group></Col>
          </Row>

          <hr className="my-4" />
          <h5>Select Students</h5>

          <Row className="mt-2">
            <Col md={6}><Form.Group><Form.Label>Select Class</Form.Label>
              <Form.Select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} required>
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </Form.Select></Form.Group></Col>

            <Col md={6}><Form.Group><Form.Label>Students in Selected Class</Form.Label>
              <Form.Select multiple onChange={handleStudentSelect}>
                {filteredStudents.map((s) => (
                  <option key={s._id} value={s._id}>{s.fullName}</option>
                ))}
              </Form.Select></Form.Group></Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit">Register Parent</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddParent;
