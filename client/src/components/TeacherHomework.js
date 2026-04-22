// TeacherHomework.js
// Location: client/src/components/TeacherHomework.js

import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import './TeacherHomework.css';

const TeacherHomework = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classIds: [],
    subject: '',
    dueDate: ''
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [homeworkList, setHomeworkList] = useState([]);
  const [stats, setStats] = useState({});
  const [resendingId, setResendingId] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchTeacherHomework();
  }, []);

  const token = localStorage.getItem('token');

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showMessage('❌ Error fetching classes', 'error');
    }
  };

  const fetchTeacherHomework = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/homework/my-homework', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHomeworkList(response.data.homework || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleClassChange = (e) => {
    const selectedClasses = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, classIds: selectedClasses });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showMessage('❌ Please enter homework title', 'error');
      return;
    }

    if (!formData.description.trim()) {
      showMessage('❌ Please enter homework description', 'error');
      return;
    }

    if (formData.classIds.length === 0) {
      showMessage('❌ Please select at least one class', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/homework', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage(
        `✅ Success! ${response.data.summary.sent} messages sent, ${response.data.summary.failed} failed`,
        'success'
      );

      setFormData({ title: '', description: '', classIds: [], subject: '', dueDate: '' });
      fetchTeacherHomework();
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      showMessage(`❌ Error: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendFailed = async (homeworkId) => {
    setResendingId(homeworkId);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/homework/${homeworkId}/resend-failed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage(
        `✅ Resent ${response.data.resent} messages, ${response.data.failed} failed`,
        'success'
      );
      fetchTeacherHomework();
    } catch (error) {
      showMessage(`❌ Error: ${error.response?.data?.error}`, 'error');
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = async (homeworkId, status) => {
    if (status !== 'pending') {
      showMessage('❌ Can only delete unsent homework', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this homework?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/homework/${homeworkId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showMessage('✅ Homework deleted successfully', 'success');
        fetchTeacherHomework();
      } catch (error) {
        showMessage(`❌ Error: ${error.response?.data?.error}`, 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'completed': '✅ Completed',
      'sending': '📤 Sending',
      'pending': '⏳ Pending',
      'failed': '❌ Failed'
    };
    return badges[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      'completed': 'status-completed',
      'sending': 'status-sending',
      'pending': 'status-pending',
      'failed': 'status-failed'
    };
    return classes[status] || '';
  };

  return (
    <div className="teacher-homework-container">
      <div className="hw-header">
        <h2>📚 Send Homework to Students</h2>
        <p>Automatically send homework to all students of selected classes via WhatsApp</p>
      </div>

      {message && (
        <div className={`alert alert-${messageType}`}>
          {message}
        </div>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total || 0}</div>
          <div className="stat-label">Total Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.sent || 0}</div>
          <div className="stat-label">Successfully Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.failed || 0}</div>
          <div className="stat-label">Failed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {/* Form */}
      <div className="hw-form-section">
        <h3>📝 Create Homework</h3>
        <form onSubmit={handleSubmit} className="homework-form">
          <div className="form-row">
            <div className="form-group">
              <label>Homework Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Chapter 5 Exercise"
                required
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed homework instructions. Include:
- Questions or exercises to solve
- Page numbers
- Expected format
- Any additional notes"
              rows="5"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Select Classes (Multiple) *</label>
              <select
                multiple
                value={formData.classIds}
                onChange={handleClassChange}
                required
              >
                <option value="">-- Select Classes --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <small>💡 Hold Ctrl/Cmd to select multiple classes</small>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary"
            >
              {loading ? '📤 Sending...' : '📤 Send Homework via WhatsApp'}
            </button>
            <button 
              type="reset" 
              className="btn-secondary"
              onClick={() => setFormData({ title: '', description: '', classIds: [], subject: '', dueDate: '' })}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Homework History */}
      <div className="hw-history-section">
        <h3>📋 Homework History</h3>

        {homeworkList.length === 0 ? (
          <div className="empty-state">
            <p>📭 No homework sent yet. Create one above!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="homework-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Classes</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Sent / Failed</th>
                  <th>Due Date</th>
                  <th>Sent On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {homeworkList.map(hw => (
                  <tr key={hw._id}>
                    <td>
                      <strong>{hw.title}</strong>
                      {hw.description && (
                        <p className="description-preview">{hw.description.substring(0, 100)}...</p>
                      )}
                    </td>
                    <td>
                      <div className="class-list">
                        {hw.classIds && hw.classIds.map(cls => (
                          <span key={cls._id} className="class-badge">
                            {cls.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{hw.subject || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(hw.whatsappStatus)}`}>
                        {getStatusBadge(hw.whatsappStatus)}
                      </span>
                    </td>
                    <td>
                      <span className="sent-count">✅ {hw.successfulSends}</span>
                      {hw.failedSends > 0 && (
                        <span className="failed-count">❌ {hw.failedSends}</span>
                      )}
                    </td>
                    <td>
                      {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      {hw.sentAt ? new Date(hw.sentAt).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {hw.failedSends > 0 && (
                          <button
                            className="btn-resend"
                            onClick={() => handleResendFailed(hw._id)}
                            disabled={resendingId === hw._id}
                            title="Resend failed messages"
                          >
                            {resendingId === hw._id ? '⏳' : '🔄 Resend'}
                          </button>
                        )}
                        {hw.whatsappStatus === 'pending' && (
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(hw._id, hw.whatsappStatus)}
                            title="Delete unsent homework"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherHomework;
