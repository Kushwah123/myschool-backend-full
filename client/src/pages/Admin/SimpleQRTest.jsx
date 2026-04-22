import React from 'react';

const SimpleQRTest = () => {
  // Sample QR code from the API
  const testQRString = '2@7aElSncGwZNIi/RQPc6pSGwIRW7GIQWSkV95hcXK9DbN2oAINSdVCjHVfLOxIfxrXNerpwOSL9QxBU8WDyS7Ol7mSL76Z3gF1m8=,1hfilBaJ9V9/nmYNatWr2OfohEBDoANBSA5B0slZaS0=,b1h4yp0dIXfvW4RnRaP0pLCJYjggtrnrHc0qYAENVHc=,nkEPnu7gQQnipuTHumAq8KxFHchJaGfmuozFXNPfG/o=,1';
  
  // Create QR code URL using QR service
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(testQRString)}`;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">✅ Simple QR Code Test</h4>
        </div>
        <div className="card-body text-center">
          <p className="mb-4">
            If you see a QR code below, then QR rendering is working!
          </p>
          
          <div className="p-4 bg-light rounded mb-4">
            <img 
              src={qrImageUrl}
              alt="Simple QR Code Test"
              style={{
                width: '300px',
                height: '300px',
                border: '3px solid #25D366',
                padding: '10px',
              }}
            />
          </div>

          <div className="alert alert-success">
            <strong>✅ If you see the QR code above:</strong>
            <ul className="mb-0 mt-2">
              <li>QR rendering is working</li>
              <li>Your browser can fetch external images</li>
              <li>The main page should also work now</li>
            </ul>
          </div>

          <div className="alert alert-warning">
            <strong>⚠️ If you DON'T see QR code:</strong>
            <ul className="mb-0 mt-2">
              <li>Check internet connection</li>
              <li>Open browser console (F12)</li>
              <li>Look for network errors</li>
              <li>Try main page anyway</li>
            </ul>
          </div>

          <a href="/admin/whatsapp-settings" className="btn btn-success btn-lg mt-3">
            Go to Main WhatsApp Settings Page →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimpleQRTest;
