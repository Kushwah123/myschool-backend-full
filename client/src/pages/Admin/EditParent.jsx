import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Container, Spinner, Alert } from "react-bootstrap";
import { updateParent, fetchParents } from "../../redux/slices/parentSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditParent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { parents, loading, error } = useSelector((state) => state.parents);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    relation: "",
  });

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  useEffect(() => {
    const parent = parents.find((p) => p._id === id);
    if (parent) {
      setFormData({
        fullName: parent.fullName,
        email: parent.email,
        mobile: parent.mobile,
        relation: parent.relation,
      });
    }
  }, [id, parents]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateParent({ id, parentData: formData })).unwrap();
      toast.success("✅ Parent updated");
      navigate("/admin/parents");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Container className="my-4">
      <Card className="p-4 shadow">
        <h4>Edit Parent</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Full Name</Form.Label>
            <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Mobile</Form.Label>
            <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Relation</Form.Label>
            <Form.Control name="relation" value={formData.relation} onChange={handleChange} />
          </Form.Group>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Update Parent"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default EditParent;
