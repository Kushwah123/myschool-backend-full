import React from 'react';

const statusConfig = {
  calling: { text: 'Calling...', className: 'text-primary' },
  connected: { text: 'Connected', className: 'text-success' },
  busy: { text: 'Busy', className: 'text-warning' },
  failed: { text: 'Failed', className: 'text-danger' },
  completed: { text: 'Completed', className: 'text-success' },
};

const CallingModal = ({ open, status, studentName, parentNumber, onClose }) => {
  if (!open) return null;

  const config = statusConfig[status] || statusConfig.calling;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.45)', zIndex: 1080 }}
    >
      <div className="card shadow-lg" style={{ width: 'min(92vw, 420px)' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="mb-0">Parent Call Status</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <p className="mb-1">
            <strong>Student:</strong> {studentName}
          </p>
          <p className="mb-3">
            <strong>Number:</strong> {parentNumber}
          </p>
          <div className={`fw-bold fs-5 ${config.className}`}>{config.text}</div>
        </div>
      </div>
    </div>
  );
};

export default CallingModal;

