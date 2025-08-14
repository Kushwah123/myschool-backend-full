import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudents,
  deleteStudent,
  deleteMultipleStudents,
} from '../../redux/slices/studentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchVillages } from '../../redux/slices/villageSlice';
import { Table, Form, Button, Pagination, Card, Row, Col } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const AllStudents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students = [] } = useSelector((state) => state.students);
  const { classes = [] } = useSelector((state) => state.class);
  const { list: villages = [] } = useSelector((state) => state.village);

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterVillage, setFilterVillage] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const componentRef = useRef();

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
    dispatch(fetchVillages());
  }, [dispatch]);

  const filteredStudents = students.filter(
    (s) =>
      (!filterClass || s.classId?._id === filterClass) &&
      (!filterVillage || s.villageId?._id === filterVillage) &&
      (s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber?.toString().includes(search))
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrint = useReactToPrint({ content: () => componentRef.current });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStudents.map((s) => ({
        Name: s.fullName,
        Roll: s.rollNumber,
        Class: s.classId?.name,
        Village: s.villageId?.villageName,
        Aadhaar: s.aadharNumber,
        Mobile: s.mobile,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Students');
    XLSX.writeFile(wb, 'AllStudents.xlsx');
  };

  const handlePageChange = (number) => setCurrentPage(number);

  const handleEdit = (id) => navigate(`/students/edit/${id}`);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudent(id)).then(() => toast.success('Student deleted!'));
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected students?`)) {
      dispatch(deleteMultipleStudents(selectedIds))
        .then(() => {
          toast.success('Selected students deleted!');
          setSelectedIds([]);
        })
        .catch(() => toast.error('Failed to delete selected students.'));
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="mb-4 text-primary text-center">📋 All Students</h3>

          {/* Filters */}
          <Row className="align-items-center mb-3">
            <Col md={3}>
              <Form.Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="">📚 All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="🔍 Search by name or roll"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Select value={filterVillage} onChange={(e) => setFilterVillage(e.target.value)}>
                <option value="">🏘️ All Villages</option>
                {villages.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.villageName}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3} className="d-flex gap-2">
              <Button variant="success" onClick={handlePrint} className="w-100">
                📄 Export PDF
              </Button>
              <Button variant="warning" onClick={exportToExcel} className="w-100">
                📊 Export Excel
              </Button>
            </Col>
          </Row>

          {/* Bulk Actions */}
          <Row className="mb-3">
            <Col className="text-end">
              <Button
                variant="danger"
                disabled={selectedIds.length === 0}
                onClick={handleDeleteSelected}
              >
                🗑️ Delete Selected ({selectedIds.length})
              </Button>
            </Col>
          </Row>

          {/* Table */}
          <div ref={componentRef}>
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-dark">
                <tr>
                  <th>Select</th>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Village</th>
                  <th>Aadhaar</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(s._id)}
                        onChange={() => handleSelect(s._id)}
                      />
                    </td>
                    <td>{s.rollNumber}</td>
                    <td>{s.fullName}</td>
                    <td>{s.classId?.name}</td>
                    <td>{s.villageId?.villageName || '-'}</td>
                    <td>{s.aadharNumber}</td>
                    <td>{s.mobile}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEdit(s._id)}
                        className="me-2"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(s._id)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AllStudents;
