// AdminHomework.js
// Location: client/src/components/AdminHomework.js

import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import './AdminHomework.css';

const AdminHomework = () => {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});

  const [filters, setFilters] = useState({
    status: '',
    teacherId: '',
    classId: '',
    page: 1,
    limit: 10
  });

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchAllHomework();
  }, []);

  useEffect(() => {
    fetchAllHomework();
  }, [filters]);

  const token = localStorage.getItem('token');

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchAllHomework = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.teacherId) queryParams.append('teacherId', filters.teacherId);
      if (filters.classId) queryParams.append('classId', filters.classId);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);

      const response = await axios.get(
        `http://localhost:5000/api/homework/admin/all?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHomework(response.data.homework || []);
      setStats(response.data.stats || {});
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (homeworkId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/homework/admin/${homeworkId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedHomework(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
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
    <div className="admin-homework-container">
      <div className="hw-header">
        <h2>📚 Homework Management</h2>
        <p>Monitor all homework sent by teachers and track delivery status</p>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed || 0}</div>
          </div>
        </div>

        <div className="stat-card failed">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-label">Failed</div>
            <div className="stat-value">{stats.failed || 0}</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending || 0}</div>
          </div>
        </div>

        <div className="stat-card sending">
          <div className="stat-icon">📤</div>
          <div className="stat-info">
            <div className="stat-label">Sending</div>
            <div className="stat-value">{stats.sending || 0}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>🔍 Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="completed">✅ Completed</option>
              <option value="sending">📤 Sending</option>
              <option value="pending">⏳ Pending</option>
              <option value="failed">❌ Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Teacher</label>
            <select
              name="teacherId"
              value={filters.teacherId}
              onChange={handleFilterChange}
            >
              <option value="">All Teachers</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Class</label>
            <select
              name="classId"
              value={filters.classId}
              onChange={handleFilterChange}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Limit</label>
            <select
              name="limit"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: e.target.value, page: 1 })}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Homework Table */}
      <div className="homework-section">
        <h3>📋 Homework List</h3>

        {loading ? (
          <div className="loading">⏳ Loading...</div>
        ) : homework.length === 0 ? (
          <div className="empty-state">
            <p>📭 No homework found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="homework-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Teacher</th>
                    <th>Classes</th>
                    <th>Status</th>
                    <th>Sent / Failed</th>
                    <th>Total</th>
                    <th>Due Date</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homework.map(hw => (
                    <tr key={hw._id}>
                      <td>
                        <strong>{hw.title}</strong>
                        {hw.subject && <p className="subject">{hw.subject}</p>}
                      </td>
                      <td>
                        <div>
                          <strong>{hw.teacher?.name}</strong>
                          <br />
                          <small>{hw.teacher?.mobile}</small>
                        </div>
                      </td>
                      <td>
                        <div className="classes-list">
                          {hw.classIds && hw.classIds.map(cls => (
                            <span key={cls._id} className="class-tag">
                              {cls.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(hw.whatsappStatus)}`}>
                          {getStatusBadge(hw.whatsappStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="delivery-stats">
                          <span className="sent">✅ {hw.successfulSends}</span>
                          {hw.failedSends > 0 && (
                            <span className="failed">❌ {hw.failedSends}</span>
                          )}
                        </div>
                      </td>
                      <td>{hw.totalRecipients}</td>
                      <td>
                        {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        {hw.createdAt ? new Date(hw.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <button
                          className="btn-view-details"
                          onClick={() => handleViewDetails(hw._id)}
                        >
                          📄 View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  ← Previous
                </button>

                <div className="page-info">
                  Page {pagination.page} of {pagination.pages}
                </div>

                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedHomework && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>
              ✕
            </button>

            <div className="modal-header">
              <h3>📋 Homework Details</h3>
              <span className={`status-badge ${getStatusClass(selectedHomework.whatsappStatus)}`}>
                {getStatusBadge(selectedHomework.whatsappStatus)}
              </span>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>📚 Homework Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Title:</label>
                    <span>{selectedHomework.title}</span>
                  </div>
                  <div className="detail-item">
                    <label>Teacher:</label>
                    <span>
                      {selectedHomework.teacher?.name}
                      <br />
                      <small>{selectedHomework.teacher?.email}</small>
                      <br />
                      <small>{selectedHomework.teacher?.mobile}</small>
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Subject:</label>
                    <span>{selectedHomework.subject || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Classes:</label>
                    <span>
                      {selectedHomework.classIds?.map(c => c.name).join(', ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Due Date:</label>
                    <span>
                      {selectedHomework.dueDate ? new Date(selectedHomework.dueDate).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Created:</label>
                    <span>
                      {selectedHomework.createdAt ? new Date(selectedHomework.createdAt).toLocaleString() : '-'}
                    </span>
                  </div>
                </div>

                <div className="description-box">
                  <h5>Description:</h5>
                  <p>{selectedHomework.description}</p>
                </div>
              </div>

              <div className="detail-section">
                <h4>📊 Delivery Statistics</h4>
                <div className="stats-bar">
                  <div className="stat-item">
                    <span className="label">Total Recipients:</span>
                    <span className="value">{selectedHomework.totalRecipients}</span>
                  </div>
                  <div className="stat-item success">
                    <span className="label">✅ Successfully Sent:</span>
                    <span className="value">{selectedHomework.successfulSends}</span>
                  </div>
                  <div className="stat-item failed">
                    <span className="label">❌ Failed:</span>
                    <span className="value">{selectedHomework.failedSends}</span>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill success"
                    style={{
                      width: `${(selectedHomework.successfulSends / selectedHomework.totalRecipients) * 100}%`
                    }}
                  />
                  <div
                    className="progress-fill failed"
                    style={{
                      width: `${(selectedHomework.failedSends / selectedHomework.totalRecipients) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="detail-section">
                <h4>👥 Delivery Report</h4>
                <div className="recipients-table-wrapper">
                  <table className="recipients-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Parent</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                        <th>Sent Time</th>
                        <th>Error (if any)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHomework.recipients?.map((recipient, idx) => (
                        <tr key={idx}>
                          <td>
                            <div>
                              <strong>{recipient.studentId?.fullName}</strong>
                              <br />
                              <small>{recipient.studentId?.admissionNumber}</small>
                            </div>
                          </td>
                          <td>{recipient.parentId?.fullName}</td>
                          <td>
                            <a href={`https://wa.me/${recipient.phoneNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                              {recipient.phoneNumber}
                            </a>
                          </td>
                          <td>
                            <span className={`delivery-status ${recipient.status}`}>
                              {recipient.status === 'sent' ? '✅ Sent' : '❌ Failed'}
                            </span>
                          </td>
                          <td>
                            {recipient.sentTime ? new Date(recipient.sentTime).toLocaleString() : '-'}
                          </td>
                          <td>
                            {recipient.errorReason ? (
                              <span className="error-reason">{recipient.errorReason}</span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomework;
