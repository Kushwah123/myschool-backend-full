import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../redux/slices/classSlice';
import { fetchStudents } from '../../redux/slices/studentSlice';
import { FaWhatsapp, FaPhone, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../../axiosInstance';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CallButton from '../../components/calls/CallButton';
import CallingModal from '../../components/calls/CallingModal';
import CallHistorySection from '../../components/calls/CallHistorySection';
import './StudentDirectory.css';

const StudentDirectory = () => {
  const dispatch = useDispatch();
  const { classes, loading: classesLoading } = useSelector((state) => state.class);
  const { students } = useSelector((state) => state.students);
  const { user, token } = useSelector((state) => state.auth);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeCallId, setActiveCallId] = useState('');
  const [activeCallStudent, setActiveCallStudent] = useState('');
  const [activeCallNumber, setActiveCallNumber] = useState('');
  const [callHistory, setCallHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [viewMode, setViewMode] = useState('auto');

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    console.log('Classes from Redux:', classes);
  }, [classes]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setViewMode('card');
      } else {
        setViewMode('table');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!token) return;
    const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketURL, { transports: ['websocket'], reconnection: true });

    socket.on('connect', () => socket.emit('teacher:join', { token }));
    socket.on('call:update', (payload) => {
      if (!payload?.callId || payload.callId !== activeCallId) return;
      setCallStatus(payload.status);
      if (payload.status === 'connected') toast.success('Call connected');
      else if (payload.status === 'busy') toast.warning('Gateway busy');
      else if (payload.status === 'failed') toast.error('Call failed');
      else if (payload.status === 'completed') toast.success('Call completed');

      if (['busy', 'failed', 'completed'].includes(payload.status)) {
        setTimeout(() => {
          setIsCallModalOpen(false);
          setActiveCallId('');
        }, 1200);
        fetchCallHistory();
      }
    });
    socket.on('call:error', (payload) => toast.error(payload?.msg || 'Call error'));
    return () => socket.disconnect();
  }, [token, activeCallId]);

  const studentsToDisplay = selectedClass
    ? students.filter((s) => (s.classId?._id || s.classId) === selectedClass)
    : students;

  const openWhatsApp = (number, studentName) => {
    if (!number) return alert('No WhatsApp number available');
    const msg = `Hello ${studentName}, your teacher would like to connect`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const fetchCallHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get('/calls/history');
      setCallHistory(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load call history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const handleInitiateCall = async (student) => {
    if (!student?.mobile) {
      toast.warning('No parent number available');
      return;
    }
    try {
      setActiveCallStudent(student.fullName);
      setActiveCallNumber(student.mobile);
      setCallStatus('calling');
      setIsCallModalOpen(true);
      const response = await axios.post('/calls/initiate', {
        studentId: student._id,
        studentName: student.fullName,
        parentNumber: student.mobile,
        teacherId: user?._id,
        teacherName: user?.name,
      });
      setActiveCallId(response.data?.data?.callId || '');
      toast.info('Call request sent');
    } catch (error) {
      setCallStatus('failed');
      toast.error('Unable to initiate call');
      setTimeout(() => setIsCallModalOpen(false), 1200);
    }
  };

  const filteredStudents = studentsToDisplay.filter((student) => {
    const query = searchText.trim().toLowerCase();
    const match = !query || 
      student.fullName?.toLowerCase().includes(query) ||
      student.fatherName?.toLowerCase().includes(query) ||
      student.mobile?.toLowerCase().includes(query) ||
      student.address?.toLowerCase().includes(query);
    const addrMatch = !filterAddress || student.address?.toLowerCase() === filterAddress.toLowerCase();
    return match && addrMatch;
  });

  const addresses = [...new Set(studentsToDisplay.map((s) => s.address).filter(Boolean))];

  return (
    <div className="student-directory">
      <div className="directory-header">
        <h2 className="directory-title">Student Directory</h2>
        <p className="directory-subtitle">Manage and contact student parents</p>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Filter by Class</label>
            <select 
              className="form-control filter-select" 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={classesLoading}
            >
              <option value="">
                {classesLoading ? '-- Loading Classes --' : '-- All Classes --'}
              </option>
              {classes && classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option disabled>No classes available</option>
              )}
            </select>
            {classes && classes.length === 0 && !classesLoading && (
              <small className="text-danger">No classes loaded. Please refresh the page.</small>
            )}
          </div>
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input type="text" className="form-control filter-input" placeholder="Student or father name..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Filter by Address</label>
            <select className="form-control filter-select" value={filterAddress} onChange={(e) => setFilterAddress(e.target.value)}>
              <option value="">-- All Addresses --</option>
              {addresses.map((address) => <option key={address} value={address}>{address}</option>)}
            </select>
          </div>
        </div>
        <div className="results-info">
          <span className="results-count">{filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found</span>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="empty-state">
          <FaExclamationCircle className="empty-icon" />
          <p className="empty-message">No students match your search/filter criteria.</p>
        </div>
      )}

      {filteredStudents.length > 0 && viewMode === 'table' && (
        <div className="table-view">
          <div className="table-responsive">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Father</th>
                  <th>Address</th>
                  <th>Mobile</th>
                  <th>WhatsApp</th>
                  <th>Complaint</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="student-row">
                    <td className="cell-name">{student.fullName}</td>
                    <td className="cell-father">{student.fatherName || '-'}</td>
                    <td className="cell-address">{student.address || '-'}</td>
                    <td className="cell-mobile">{student.mobile || 'N/A'}</td>
                    <td className="cell-action">
                      <div className="action-buttons">
                        <button className="btn btn-whatsapp" onClick={() => openWhatsApp(student.mobile, student.fullName)} title="Open WhatsApp">
                          <FaWhatsapp /> Chat
                        </button>
                        <CallButton onClick={() => handleInitiateCall(student)} disabled={!student.mobile} />
                      </div>
                    </td>
                    <td className="cell-action">
                      <Link to={`/teacher/complaints?studentId=${student._id}&classId=${selectedClass}`} className="btn btn-complaint">
                        Complaint
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredStudents.length > 0 && viewMode === 'card' && (
        <div className="card-view">
          {filteredStudents.map((student) => (
            <div key={student._id} className="student-card">
              <div className="card-header">
                <h5 className="card-name">{student.fullName}</h5>
                <span className="card-badge">{student.rollNo || 'N/A'}</span>
              </div>
              <div className="card-body">
                <div className="card-field">
                  <span className="field-label">Father Name</span>
                  <span className="field-value">{student.fatherName || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="field-label">Address</span>
                  <span className="field-value">{student.address || '-'}</span>
                </div>
                <div className="card-field">
                  <span className="field-label">Mobile</span>
                  <span className="field-value">
                    {student.mobile ? <a href={`tel:${student.mobile}`} className="mobile-link">{student.mobile}</a> : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <button className="card-btn btn-whatsapp-mobile" onClick={() => openWhatsApp(student.mobile, student.fullName)} title="Open WhatsApp">
                  <FaWhatsapp /><span>Chat</span>
                </button>
                <button className="card-btn btn-call-mobile" onClick={() => handleInitiateCall(student)} disabled={!student.mobile} title="Call parent">
                  <FaPhone /><span>Call</span>
                </button>
                <Link to={`/teacher/complaints?studentId=${student._id}&classId=${selectedClass}`} className="card-btn btn-complaint-mobile" title="Raise complaint">
                  <FaExclamationCircle /><span>Report</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <CallHistorySection history={callHistory} loading={historyLoading} />
      <CallingModal open={isCallModalOpen} status={callStatus} studentName={activeCallStudent} parentNumber={activeCallNumber} onClose={() => setIsCallModalOpen(false)} />
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default StudentDirectory;
