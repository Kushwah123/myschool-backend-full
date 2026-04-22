import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRLogin = () => {
  const [token, setToken] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const generatedToken = `admin-qr-${Date.now()}`;
    setToken(generatedToken);
    const loginUrl = `${window.location.origin}/admin/qr-auth?token=${generatedToken}`;
    QRCode.toDataURL(loginUrl)
      .then((url) => setQrDataUrl(url))
      .catch((error) => console.error('QR generate error', error));
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">Admin QR Authentication</h3>
        <p>This page generates a one-time QR code for secure admin authentication.</p>
        <div className="mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Admin QR Login" className="img-fluid" />
          ) : (
            <p>Generating QR code...</p>
          )}
        </div>
        <div className="alert alert-info">
          <p><strong>How to use:</strong></p>
          <ol>
            <li>Scan this QR code with a mobile camera or QR scanner.</li>
            <li>Your device will open a login link for authorized admin access.</li>
            <li>If needed, copy the token below into the admin QR login form.</li>
          </ol>
          <p><strong>Token:</strong> {token}</p>
        </div>
      </div>
    </div>
  );
};

export default QRLogin;
