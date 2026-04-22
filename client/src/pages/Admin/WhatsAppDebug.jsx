import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';

const WhatsAppDebug = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoCheck, setAutoCheck] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Testing /attendance/whatsapp/qr-status...');
      
      const response = await axiosInstance.get('/attendance/whatsapp/qr-status');
      
      console.log('✅ Response received:', response.data);
      setApiResponse(response.data);
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      testAPI();
      const interval = setInterval(testAPI, 2000);
      return () => clearInterval(interval);
    }
  }, [autoCheck]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-danger text-white">
          <h5>🐛 WhatsApp Debug Console (Dev Only)</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <button className="btn btn-danger me-2" onClick={testAPI} disabled={loading}>
              {loading ? 'Testing...' : 'Test API Endpoint'}
            </button>
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="autoCheck"
                checked={autoCheck}
                onChange={(e) => setAutoCheck(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="autoCheck">
                Auto-check every 2 seconds
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
          )}

          {apiResponse && (
            <div>
              <div className="alert alert-success">
                <strong>✅ API Response Received</strong>
              </div>
              <div className="bg-light p-3 rounded">
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>

              <div className="mt-3">
                <h6>🔍 Response Analysis:</h6>
                <table className="table table-sm table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Has QR Code?</strong></td>
                      <td>{apiResponse.qr ? '✅ YES' : '❌ NO'}</td>
                    </tr>
                    <tr>
                      <td><strong>QR Code Length:</strong></td>
                      <td>{apiResponse.qr ? apiResponse.qr.length : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{apiResponse.status}</td>
                    </tr>
                    <tr>
                      <td><strong>Is Ready:</strong></td>
                      <td>{apiResponse.isReady ? '✅ YES' : '⏳ NO'}</td>
                    </tr>
                    <tr>
                      <td><strong>Message:</strong></td>
                      <td>{apiResponse.message}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {apiResponse.qr && (
                <div className="alert alert-info mt-3">
                  <strong>QR Code Data (first 100 chars):</strong>
                  <br />
                  <code style={{ wordBreak: 'break-all', fontSize: '10px' }}>
                    {apiResponse.qr.substring(0, 100)}...
                  </code>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-light rounded">
            <h6>📋 Browser Console:</h6>
            <p className="text-muted small">
              Open browser Developer Tools (F12) → Console tab to see detailed logs
            </p>
            <p className="text-muted small">
              Server logs should show each API request with status details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDebug;
