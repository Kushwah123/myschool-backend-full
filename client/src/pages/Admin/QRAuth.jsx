import React from 'react';
import { useSearchParams } from 'react-router-dom';

const QRAuth = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3>QR Authorization</h3>
        {token ? (
          <>
            <p>Your scanned login token is:</p>
            <div className="alert alert-success">{token}</div>
            <p>Use this token to complete admin authentication in the next step.</p>
          </>
        ) : (
          <p className="text-muted">No QR token was provided. Scan a valid admin QR code to continue.</p>
        )}
      </div>
    </div>
  );
};

export default QRAuth;
