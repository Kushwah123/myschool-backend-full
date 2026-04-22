import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchStudentsByClass } from '../../redux/slices/studentSlice';
import { markAttendance } from '../../redux/slices/attendanceSlice';
import axiosInstance from '../../axiosInstance';
import { FaWhatsapp } from 'react-icons/fa';

const Attendance = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappStatus, setWhatsappStatus] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [whatsappResults, setWhatsappResults] = useState([]);

  const classes = useSelector((state) => state.class?.classes || []);
  const { classStudents: students } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchClasses());
    checkWhatsAppStatus();
  }, [dispatch]);

  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0]._id);
    }
  }, [classes, selectedClass]);

  useEffect(() => {
    if (selectedClass) dispatch(fetchStudentsByClass(selectedClass));
  }, [dispatch, selectedClass]);

  useEffect(() => {
    const initial = students.map((s) => ({
      studentId: s._id,
      status: 'Present',
    }));
    setAttendance(initial);
  }, [students]);

  const presentCount = attendance.filter((item) => item.status === 'Present').length;
  const absentCount = attendance.filter((item) => item.status === 'Absent').length;

  const checkWhatsAppStatus = async () => {
    try {
      const response = await axiosInstance.get('/attendance/whatsapp/status');
      setWhatsappStatus(response.data.status);
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
      setWhatsappStatus('error');
    }
  };

  const handleChange = (studentId, status) => {
    setAttendance((prev) =>
      prev.map((a) =>
        a.studentId === studentId ? { ...a, status } : a
      )
    );
  };

  const handleAttendanceSubmit = async () => {
    // ✅ Validation checks
    const userId = user?._id || user?.id;
    if (!userId) {
      alert('❌ Error: User not authenticated. Please log in again.');
      return;
    }

    if (!selectedClass) {
      alert('❌ Please select a class first');
      return;
    }

    if (attendance.length === 0) {
      alert('❌ No students to mark attendance for');
      return;
    }

    setWhatsappResults([]);
    setLoading(true);
    const data = {
      classId: selectedClass,
      date: selectedDate,
      records: attendance.map((item) => ({ student: item.studentId, status: item.status })),
      teacherId: userId,
      sendWhatsApp: whatsappEnabled,
    };

    try {
      console.log('📤 Submitting attendance:', data);  // ✅ Debug log
      const result = await dispatch(markAttendance(data)).unwrap();
      const present = result.attendance.filter((item) => item.status === 'Present').length;
      const absent = result.attendance.filter((item) => item.status === 'Absent').length;
      const whatsappStatusText = whatsappEnabled
        ? result.whatsapp
          ? ` 📱 WhatsApp: ${result.whatsapp.success} sent, ${result.whatsapp.failed} failed${result.whatsapp.error || result.whatsapp.message ? ` (${result.whatsapp.error || result.whatsapp.message})` : ''}`
          : ' 📱 WhatsApp notifications were attempted.'
        : '';

      setSuccessMessage(
        `✅ Attendance submitted! ${present} present, ${absent} absent.${whatsappStatusText}`
      );
      setWhatsappResults(result.whatsapp?.results || []);

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('❌ Error details:', err);
      
      // ✅ Better error messages
      if (typeof err === 'object' && err.missingFields) {
        alert(`❌ Missing required fields:\n${JSON.stringify(err.missingFields, null, 2)}`);
      } else if (err?.message) {
        alert(`❌ Error: ${err.message}`);
      } else if (typeof err === 'string') {
        alert(`❌ Error: ${err}`);
      } else {
        alert('❌ Failed to submit attendance. Please check console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Mark Attendance</h3>
      <div className="card p-3 shadow-sm">
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage('')}
            ></button>
          </div>
        )}

        {/* WhatsApp Status & Toggle */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Class</label>
            <select
              className="form-control"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              required
            >
              <option value="">--Select Class--</option>
              {classes.length === 0 ? (
                <option value="" disabled>
                  No classes available
                </option>
              ) : (
                classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name || cls.className || 'Untitled Class'}
                    {cls.section ? ` (${cls.section})` : ''}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="col-md-4">
            <label>Attendance Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="col-md-4">
            <div className="p-2 border rounded bg-light">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <FaWhatsapp className="text-success me-2" size={20} />
                  <strong>WhatsApp Notifications</strong>
                </div>
                {whatsappStatus === 'ready' ? (
                  <span className="badge bg-success">Connected ✅</span>
                ) : whatsappStatus === 'initializing' ? (
                  <span className="badge bg-warning">Initializing ⏳</span>
                ) : (
                  <span className="badge bg-danger">Error ❌</span>
                )}
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="whatsappToggle"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  disabled={whatsappStatus !== 'ready'}
                />
                <label className="form-check-label" htmlFor="whatsappToggle">
                  {whatsappStatus === 'ready'
                    ? 'Send WhatsApp notifications to parents'
                    : 'WhatsApp not ready. Scan QR code on server console.'}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <div className="alert alert-info py-2 mb-0">
              <strong>Total Students:</strong> {students.length}
            </div>
          </div>
          <div className="col-md-4">
            <div className="alert alert-success py-2 mb-0">
              <strong>Present:</strong> {presentCount}
            </div>
          </div>
          <div className="col-md-4">
            <div className="alert alert-danger py-2 mb-0">
              <strong>Absent:</strong> {absentCount}
            </div>
          </div>
        </div>

        {students.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu._id}>
                    <td>{stu.fullName}</td>
                    <td>
                      {classes.find(cls => cls._id === selectedClass)?.name || 'N/A'}
                      {classes.find(cls => cls._id === selectedClass)?.section ? ` (${classes.find(cls => cls._id === selectedClass)?.section})` : ''}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={
                          attendance.find((a) => a.studentId === stu._id)
                            ?.status || 'Present'
                        }
                        onChange={(e) =>
                          handleChange(stu._id, e.target.value)
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button 
          className="btn btn-success mt-3" 
          onClick={handleAttendanceSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Attendance'}
        </button>

        {whatsappResults.length > 0 && (
          <div className="mt-4">
            <h5>WhatsApp delivery details</h5>
            <div className="table-responsive">
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Parent</th>
                    <th>Student</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {whatsappResults.map((item, index) => (
                    <tr key={index}>
                      <td>{item.parentName || 'Unknown'}</td>
                      <td>{item.studentName || 'Unknown'}</td>
                      <td>{item.phoneNumber}</td>
                      <td>
                        <span className={`badge ${item.status === 'sent' ? 'bg-success' : 'bg-danger'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
