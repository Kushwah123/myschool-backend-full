import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceStats } from '../../redux/slices/attendanceSlice';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { stats, loading } = useSelector((state) => state.attendance);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAttendanceStats({ date: today, teacherId: user._id }));
    }
  }, [dispatch, today, user?._id]);

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col>
          <h3 className="mb-3">📋 Teacher Dashboard</h3>
          <p>Use the sidebar to manage attendance, marks, and homework.</p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Present Today</Card.Title>
              <h2 className="text-success">{stats.present ?? 0}</h2>
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
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title>Monthly Report</Card.Title>
              <p className="text-muted mb-3">View month-wise present/absent summary.</p>
              <a href="/teacher/attendance-report" className="btn btn-outline-primary btn-sm">Open Report</a>
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
                  <Card.Title className="mb-0">Today's Attendance</Card.Title>
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
    </div>
  );
};

export default Dashboard;
