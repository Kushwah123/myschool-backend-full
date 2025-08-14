import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { createParent } from "../../redux/slices/parentSlice";
import { fetchStudents } from "../../redux/slices/studentSlice";
import { fetchClasses } from "../../redux/slices/classSlice";
import { fetchVillages } from "../../redux/slices/villageSlice";
import { toast } from "react-toastify";

const AddParent = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { classes } = useSelector((state) => state.class);
  const { list: villages } = useSelector((state) => state.village);
  console.log("Villages", villages); 
villages.map((v) => console.log(v._id, v.villageName
)); // Dono print hone chahiye


  const [form, setForm] = useState({
    fullName: "", mobile: "", address: "", villageId: "", studentIds: []
  });

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
    dispatch(fetchVillages());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (selectedOptions) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setForm((prev) => ({ ...prev, studentIds: selectedIds }));
  };

  // Step 1: village-wise filter student + group by class
  const groupedStudentOptions = classes.map((cls) => ({
    label: cls.name,
    options: students
      .filter((s) => s.villageId?._id === form.villageId && s.classId?._id === cls._id)
      .map((s) => ({ label: s.fullName, value: s._id })),
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.villageId) return toast.error("Please select a village");
    if (form.studentIds.length === 0) return toast.error("Select at least one student");

    try {
      await dispatch(createParent(form)).unwrap();
      toast.success("✅ Parent registered successfully!");
      setForm({
        fullName: "", mobile: "", address: "", villageId: "", studentIds: []
      });
    } catch (err) {
      toast.error(err.message || "❌ Failed to register parent");
    }
  };

  return (
    <Container className="my-4">
      <Card className="p-4 shadow border-0">
        <h4 className="mb-3 text-center">👨‍👩‍👧 Parent Registration</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group><Form.Label>Full Name *</Form.Label>
                <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group><Form.Label>Mobile *</Form.Label>
                <Form.Control name="mobile" value={form.mobile} onChange={handleChange} maxLength={10} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group><Form.Label>Village *</Form.Label>
                <Form.Select name="villageId" value={form.villageId} onChange={handleChange} required>
                  <option value="">-- Select Village --</option>
                  {villages?.map((v) => (
                    <option key={v._id} value={v._id}>{v.villageName
}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group><Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={1} name="address" value={form.address} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />
          <h5 className="text-primary">🎓 Link Students</h5>

          <Row className="mt-2">
            <Col md={12}>
              <Form.Group><Form.Label>Select Students (Filtered by Village)</Form.Label>
                <Select
                  isMulti
                  options={groupedStudentOptions}
                  onChange={handleStudentSelect}
                  placeholder="Select student(s)..."
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit" variant="success">Register Parent</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddParent;
