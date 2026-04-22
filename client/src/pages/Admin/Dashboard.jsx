import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { fetchTeachers } from '../../redux/slices/teacherSlice';
import { fetchParents } from '../../redux/slices/parentSlice';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchAttendanceStats, fetchWhatsAppHistory } from '../../redux/slices/attendanceSlice';
import { Card, Row, Col, Container, Table } from 'react-bootstrap';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaUserGraduate,
  FaSchool
} from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();

  const { students } = useSelector((state) => state.students);
  const { teachers } = useSelector((state) => state.teachers);
  const { parents } = useSelector((state) => state.parents);
  const { classes } = useSelector((state) => state.class);
  const { stats, loading, whatsappHistory } = useSelector((state) => state.attendance);

  const today = new Date().toISOString().split('T')[0];
  const todayWhatsAppHistory = whatsappHistory.filter((entry) => entry.timestamp?.startsWith(today));
  const whatsappSuccess = todayWhatsAppHistory.reduce((sum, entry) => sum + (entry.success || 0), 0);
  const whatsappFailed = todayWhatsAppHistory.reduce((sum, entry) => sum + (entry.failed || 0), 0);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchTeachers());
    dispatch(fetchParents());
    dispatch(fetchClasses());
    dispatch(fetchAttendanceStats({ date: today }));
    dispatch(fetchWhatsAppHistory({ limit: 20 }));
  }, [dispatch, today]);

  return (
    <Container fluid className="py-4 px-4">
      <h2 className="mb-4 text-dark fw-bold">📊 Admin Dashboard</h2>
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <FaUserGraduate size={40} className="text-primary me-3" />
              <div>
                <Card.Title className="mb-0">Total Students</Card.Title>
                <h4 className="fw-bold mb-0 text-success">{students?.length || 0}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <FaChalkboardTeacher size={40} className="text-warning me-3" />
              <div>
                <Card.Title className="mb-0">Total Teachers</Card.Title>
                <h4 className="fw-bold mb-0 text-success">{teachers?.length || 0}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <FaUsers size={40} className="text-info me-3" />
              <div>
                <Card.Title className="mb-0">Total Parents</Card.Title>
                <h4 className="fw-bold mb-0 text-success">{parents?.length || 0}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <FaSchool size={40} className="text-danger me-3" />
              <div>
                <Card.Title className="mb-0">Total Classes</Card.Title>
                <h4 className="fw-bold mb-0 text-success">{classes?.length || 0}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Present Today</Card.Title>
              <h2 className="text-success">{stats.present ?? 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Absent Today</Card.Title>
              <h2 className="text-danger">{stats.absent ?? 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Total Recorded</Card.Title>
              <h2 className="text-primary">{stats.total ?? 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Attendance Report</Card.Title>
              <p className="text-muted mb-3">Month wise attendance summary.</p>
              <a href="/admin/attendance-report" className="btn btn-outline-primary btn-sm">View Report</a>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Absent Today</Card.Title>
              <h2 className="text-danger">{stats.absent ?? 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Total Recorded</Card.Title>
              <h2 className="text-primary">{stats.total ?? 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>WhatsApp Sent Today</Card.Title>
              <h2 className="text-success">{whatsappSuccess}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>WhatsApp Failed Today</Card.Title>
              <h2 className="text-danger">{whatsappFailed}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>WhatsApp Operations</Card.Title>
                  <h2 className="text-primary">{todayWhatsAppHistory.length}</h2>
                </div>
                <a href="#whatsapp-history-section" className="btn btn-sm btn-outline-primary">
                  View details
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4" id="whatsapp-history-section">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Title className="mb-0">Today's Attendance Overview</Card.Title>
                  <small className="text-muted">{today}</small>
                </div>
                {loading && <span className="text-muted">Loading...</span>}
              </div>

              {stats.records?.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.records.map((record) => (
                        <tr key={record._id}>
                          <td>{record.student?.fullName || 'Unknown'}</td>
                          <td>{record.classId?.name || record.classId?.className || 'N/A'}</td>
                          <td>
                            <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="mb-0 text-muted">No attendance records available for today.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Title className="mb-0">WhatsApp Notification History</Card.Title>
                  <small className="text-muted">Last {whatsappHistory.length || 0} operations</small>
                </div>
                {loading && <span className="text-muted">Loading...</span>}
              </div>

              {whatsappHistory.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Sent</th>
                        <th>Failed</th>
                        <th>Total</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whatsappHistory.slice(0, 10).map((entry, index) => (
                        <tr key={index}>
                          <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                          <td>{entry.success}</td>
                          <td>{entry.failed}</td>
                          <td>{entry.total}</td>
                          <td>{entry.reason || 'Attendance send record'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="mb-0 text-muted">No WhatsApp notification history available yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
