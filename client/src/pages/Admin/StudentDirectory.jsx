import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { Card, Row, Col, Form, Table, Button } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';

const StudentDirectory = () => {
  const dispatch = useDispatch();
  const { students = [] } = useSelector((state) => state.students);
  const { classes = [] } = useSelector((state) => state.class);

  const [searchText, setSearchText] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchClasses());
  }, [dispatch]);

  const openWhatsApp = (number, studentName) => {
    if (!number) return alert('No WhatsApp number available');
    const message = `Hello ${studentName}, your teacher would like to connect with you regarding attendance and updates.`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredStudents = students.filter((student) => {
    const query = searchText.trim().toLowerCase();
    const studentName = student.fullName?.toLowerCase() || '';
    const fatherName = student.fatherName?.toLowerCase() || '';
    const motherName = student.motherName?.toLowerCase() || '';
    const mobile = student.mobile?.toLowerCase() || '';
    const address = student.address?.toLowerCase() || '';

    const matchesSearch =
      !query ||
      studentName.includes(query) ||
      fatherName.includes(query) ||
      motherName.includes(query) ||
      mobile.includes(query) ||
      address.includes(query);

    const matchesClass = !filterClass || student.classId?._id === filterClass;
    const matchesAddress = !filterAddress || address === filterAddress.toLowerCase();

    return matchesSearch && matchesClass && matchesAddress;
  });

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="mb-4 text-primary text-center">🔎 Student Directory</h3>

          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search by student, father or mother"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select value={filterAddress} onChange={(e) => setFilterAddress(e.target.value)}>
                <option value="">All Addresses</option>
                {[...new Set(students.map((student) => student.address).filter(Boolean))].map((address) => (
                  <option key={address} value={address}>
                    {address}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {filteredStudents.length === 0 ? (
            <p className="text-muted">No students found for the selected search or filters.</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover responsive className="text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Father</th>
                    <th>Mother</th>
                    <th>Class</th>
                    <th>Address</th>
                    <th>Mobile</th>
                    <th>WhatsApp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.fullName}</td>
                      <td>{student.fatherName || '-'}</td>
                      <td>{student.motherName || '-'}</td>
                      <td>{student.classId?.name || student.classId?.className || '-'}</td>
                      <td>{student.address || '-'}</td>
                      <td>{student.mobile || '-'}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => openWhatsApp(student.mobile, student.fullName)}
                        >
                          <FaWhatsapp className="me-1" /> Chat
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

export default StudentDirectory;
