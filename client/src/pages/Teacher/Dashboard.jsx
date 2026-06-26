import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceStats } from '../../redux/slices/attendanceSlice';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import './Dashboard.css';

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
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">📋 Teacher Dashboard</h2>
        <p className="dashboard-subtitle">Manage attendance, marks, and homework</p>
      </div>

      {/* Stats Cards */}
      <Row className="dashboard-stats g-3 g-md-4">
        <Col xs={6} md={4} lg={3} className="stat-col">
          <Card className="stat-card stat-card--present">
            <Card.Body>
              <div className="stat-label">Present</div>
              <div className="stat-value">{stats.present ?? 0}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={3} className="stat-col">
          <Card className="stat-card stat-card--absent">
            <Card.Body>
              <div className="stat-label">Absent</div>
              <div className="stat-value">{stats.absent ?? 0}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={3} className="stat-col">
          <Card className="stat-card stat-card--total">
            <Card.Body>
              <div className="stat-label">Total</div>
              <div className="stat-value">{stats.total ?? 0}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={3} className="stat-col">
          <Card className="stat-card stat-card--report">
            <Card.Body>
              <div className="stat-label">Monthly</div>
              <a href="/teacher/attendance-report" className="btn btn-sm btn-primary mt-2">
                Report
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Attendance */}
      <Row className="mt-3 mt-md-5">
        <Col xs={12} className="attendance-col">
          <Card className="attendance-card shadow-sm border-0">
            <Card.Body>
              <div className="attendance-header">
                <div className="attendance-title-section">
                  <h5 className="attendance-title">Today's Attendance</h5>
                  <small className="attendance-date">{today}</small>
                </div>
                {loading && <span className="badge bg-info">Loading...</span>}
              </div>

              {stats.records?.length > 0 ? (
                <div className="table-responsive attendance-table-wrapper">
                  <Table striped bordered hover size="sm" className="attendance-table mb-0">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.records.map((record) => (
                        <tr key={record._id} className="attendance-row">
                          <td className="student-cell">{record.student?.fullName || 'Unknown'}</td>
                          <td className="class-cell">{record.classId?.name || record.classId?.className || 'N/A'}</td>
                          <td className="status-cell">
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
                <div className="no-data-message">
                  <p className="mb-0">No attendance records available for today.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
