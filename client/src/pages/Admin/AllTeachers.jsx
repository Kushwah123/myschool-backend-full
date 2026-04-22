// src/pages/Admin/AllTeachers.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers, deleteTeacher } from '../../redux/slices/teacherSlice';
import { Table, Form, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const AllTeachers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teachers, loading } = useSelector((state) => state.teachers);
console.log("Teachers", teachers);
  const [search, setSearch] = useState('');
  const componentRef = React.useRef();

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.mobile?.includes(search)
  );

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTeachers.map((t) => ({
        Name: t.fullName || t.name,
        Email: t.email,
        Mobile: t.mobile,
        Gender: t.gender,
        Qualification: t.qualification,
        Experience: t.experience,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Teachers');
    XLSX.writeFile(wb, 'AllTeachers.xlsx');
  };

  const handleEdit = (id) => {
    navigate(`/edit-teacher/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      dispatch(deleteTeacher(id)).then(() => {
        toast.success('Teacher deleted successfully!');
      }).catch(() => {
        toast.error('Failed to delete teacher.');
      });
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="mb-4 text-primary text-center">👨‍🏫 All Teachers</h3>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="🔍 Search by name, email or mobile"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={6} className="d-flex gap-2">
              <Button variant="success" onClick={handlePrint} className="w-100">
                📄 Export PDF
              </Button>
              <Button variant="warning" onClick={exportToExcel} className="w-100">
                📊 Export Excel
              </Button>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <div ref={componentRef}>
              <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Gender</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher._id}>
                      <td>{index + 1}</td>
                      <td>{teacher.fullName || teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.mobile}</td>
                      <td>{teacher.gender}</td>
                      <td>{teacher.qualification}</td>
                      <td>{teacher.experience ? `${teacher.experience} yrs` : '-'}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleEdit(teacher._id)}
                          className="me-2"
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(teacher._id)}
                        >
                          🗑️ Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllTeachers;
