import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const CallButton = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      className="btn btn-primary btn-sm w-100 mt-1"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? 'No parent number available' : 'Call parent via school SIM'}
    >
      <FaPhoneAlt className="me-1" />
      Call
    </button>
  );
};

export default CallButton;

