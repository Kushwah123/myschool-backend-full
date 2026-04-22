import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { Card, Table, Badge, Row, Col, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axiosInstance.get('/complaints');
        setComplaints(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load complaints.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return complaints;

    return complaints.filter((item) => {
      const studentName = item.studentId?.fullName?.toLowerCase() || '';
      const teacherName = item.teacherId?.name?.toLowerCase() || '';
      return studentName.includes(query) || teacherName.includes(query);
    });
  }, [complaints, searchText]);

  return (
    <div className="container-fluid mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3>🧾 Complaint Records</h3>
          <p className="text-muted mb-0">All complaints raised by teachers for students, with WhatsApp delivery status.</p>
        </Col>
        <Col className="text-end">
          <Link to="/admin/dashboard" className="btn btn-outline-secondary">
            Back to dashboard
          </Link>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Search by student or teacher name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Col>
              </Row>
              <div className="table-responsive">
                <Table striped bordered hover size="sm" className="align-middle text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>WhatsApp</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-muted py-4">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.studentId?.fullName || 'Unknown'}</td>
                        <td>{item.teacherId?.name || 'Unknown'}</td>
                        <td>{item.subject}</td>
                        <td>
                          <Badge bg={item.status === 'Resolved' ? 'success' : item.status === 'In Progress' ? 'warning' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </td>
                        <td>
                          {item.whatsappSent ? (
                            <Badge bg="success">Sent</Badge>
                          ) : (
                            <Badge bg="danger">Not sent</Badge>
                          )}
                        </td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Complaints;
