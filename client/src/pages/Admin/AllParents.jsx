import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchParents } from "../../redux/slices/parentSlice";
import { Link } from "react-router-dom";

const AllParents = () => {
  const dispatch = useDispatch();
  const { parents, total } = useSelector((state) => state.parents);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchParents({ page, search }));
  }, [dispatch, page, search]);

  const totalPages = Math.ceil(total / 10);


 




  return (
    <Container className="my-4">
      <h3 className="mb-4">👨‍👩‍👧 All Parents</h3>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search by name or mobile"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Relation</th>
            <th>Student</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((p) => (
            <tr key={p._id}>
              <td>{p.fullName}</td>
              <td>{p.mobile}</td>
              <td>{p.relation}</td>
              <td>{p.student?.fullName || "—"}</td>
              <td>
                <Link to={`/admin/edit-parent/${p._id}`}>
                  <Button size="sm" variant="warning" className="me-2">Edit</Button>
                </Link>
                <Button size="sm" variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >Previous</Button>

        <span>Page {page} / {totalPages}</span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >Next</Button>
      </div>
    </Container>
  );
};

export default AllParents;
