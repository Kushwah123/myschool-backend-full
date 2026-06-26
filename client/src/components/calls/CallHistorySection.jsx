import React from 'react';

const badgeClass = (status) => {
  if (status === 'connected') return 'bg-success';
  if (status === 'completed') return 'bg-primary';
  if (status === 'busy') return 'bg-warning text-dark';
  return 'bg-danger';
};

const CallHistorySection = ({ history = [], loading = false }) => {
  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Recent Call History</h5>
        {loading ? (
          <p className="text-muted mb-0">Loading call history...</p>
        ) : history.length === 0 ? (
          <p className="text-muted mb-0">No call history available yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student</th>
                  <th className="d-none d-md-table-cell">Parent Number</th>
                  <th>Status</th>
                  <th className="d-none d-lg-table-cell">Duration</th>
                  <th className="d-none d-lg-table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>{item.studentName}</td>
                    <td className="d-none d-md-table-cell">{item.parentNumber}</td>
                    <td>
                      <span className={`badge ${badgeClass(item.callStatus)}`}>{item.callStatus}</span>
                    </td>
                    <td className="d-none d-lg-table-cell">{item.duration ? `${item.duration}s` : '-'}</td>
                    <td className="d-none d-lg-table-cell">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
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

export default CallHistorySection;

