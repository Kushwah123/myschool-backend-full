import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../redux/slices/classSlice';
import axiosInstance from '../axiosInstance';
import { Card, Table, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes = [] } = useSelector((state) => state.class);

  const today = new Date();
  const [selectedClass, setSelectedClass] = useState('');
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [students, setStudents] = useState([]);
  const [days, setDays] = useState([]);
  const [totals, setTotals] = useState({ present: 0, absent: 0, studentCount: 0, completeDays: 0, totalDays: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes, selectedClass]);

  const role = user?.role || '';
  const monthName = useMemo(
    () => new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' }),
    [month, year]
  );

  const fetchReport = async () => {
    if (!selectedClass) {
      setStudents([]);
      setDays([]);
      setTotals({ present: 0, absent: 0, studentCount: 0, completeDays: 0, totalDays: 0 });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('month', month);
      params.append('year', year);
      params.append('classId', selectedClass);

      const response = await axiosInstance.get(`/attendance/monthly-student?${params.toString()}`);
      const data = response.data;
      setStudents(data.students || []);
      setDays(data.days || []);
      setTotals(data.totals || { present: 0, absent: 0, studentCount: 0, completeDays: 0, totalDays: 0 });
    } catch (err) {
      console.error('Error fetching monthly attendance report:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to load attendance report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedClass, month, year]);

  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const studentRows = useMemo(() => {
    if (!students.length || !days.length) return [];

    return students.map((student) => ({
      student,
      attendanceCells: days.map((date) => {
        const status = student.attendanceByDate?.[date] || null;
        if (status === 'Present') return { label: 'P', variant: 'success' };
        if (status === 'Absent') return { label: 'A', variant: 'danger' };
        return { label: '-', variant: 'secondary' };
      }),
    }));
  }, [students, days]);

  return (
    <div className="container-fluid mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3>📊 Monthly Attendance Report</h3>
          <p className="text-muted mb-0">Student-wise attendance for selected class and month.</p>
        </Col>
        <Col className="text-end">
          <Link to={role === 'teacher' ? '/teacher/dashboard' : '/admin/dashboard'} className="btn btn-outline-secondary">
            Back to dashboard
          </Link>
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="gy-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {new Date(year, m - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Class</Form.Label>
                <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  <option value="">Select class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name || cls.className || 'Unnamed Class'}{cls.section ? ` (${cls.section})` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={3}>
              <Card className="border-success shadow-sm mb-3">
                <Card.Body>
                  <Card.Title className="mb-2">Present</Card.Title>
                  <h3 className="text-success">{totals.present}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-danger shadow-sm mb-3">
                <Card.Body>
                  <Card.Title className="mb-2">Absent</Card.Title>
                  <h3 className="text-danger">{totals.absent}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-primary shadow-sm mb-3">
                <Card.Body>
                  <Card.Title className="mb-2">Complete Days</Card.Title>
                  <h3 className="text-primary">{totals.completeDays}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-secondary shadow-sm mb-3">
                <Card.Body>
                  <Card.Title className="mb-2">Total Days</Card.Title>
                  <h3 className="text-secondary">{totals.totalDays}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong>{monthName} {year}</strong>
              <span className="text-muted ms-3">Each day shows P/A for completed attendance.</span>
            </div>
            <Button variant="outline-primary" onClick={fetchReport} disabled={loading || !selectedClass}>
              {loading ? 'Refreshing...' : 'Refresh Report'}
            </Button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {!selectedClass ? (
            <div className="alert alert-info">Please select a class and month to show attendance.</div>
          ) : (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <Table striped bordered hover size="sm" className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Roll</th>
                    <th>Student</th>
                    {days.map((date) => (
                      <th key={date} className="text-center">{new Date(date).getDate()}</th>
                    ))}
                    <th className="text-center">P</th>
                    <th className="text-center">A</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3 + days.length + 2} className="text-center py-4">
                        Loading attendance...
                      </td>
                    </tr>
                  ) : studentRows.length > 0 ? (
                    studentRows.map(({ student, attendanceCells }, index) => (
                      <tr key={student.studentId || student._id}>
                        <td>{index + 1}</td>
                        <td>{student.rollNumber || '-'}</td>
                        <td>{student.fullName || 'Unknown Student'}</td>
                        {attendanceCells.map((cell, cellIndex) => (
                          <td key={cellIndex} className={`text-center text-${cell.variant}`}> 
                            {cell.label}
                          </td>
                        ))}
                        <td className="text-center text-success">{student.presentCount ?? 0}</td>
                        <td className="text-center text-danger">{student.absentCount ?? 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3 + days.length + 2} className="text-center text-muted py-4">
                        {loading ? 'Loading attendance...' : 'No attendance records found for this class and month.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AttendanceReport;
