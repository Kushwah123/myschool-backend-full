import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../axiosInstance';
import { FaWhatsapp, FaSync } from 'react-icons/fa';
import { isValidQRString } from '../../utils/qrCodeUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhatsAppSettings = () => {
  const [qrCode, setQrCode] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [status, setStatus] = useState('initializing');
  const [message, setMessage] = useState('Loading...');
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [gatewayDevices, setGatewayDevices] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);
  const [deviceSavingId, setDeviceSavingId] = useState('');
  const [simDrafts, setSimDrafts] = useState({});
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newSimNumber, setNewSimNumber] = useState('');
  const [creatingDevice, setCreatingDevice] = useState(false);
  const qrCanvasRef = useRef(null);

  // Generate QR image from QR string
  useEffect(() => {
    const generateQR = async () => {
      if (!qrCode) {
        console.log('ℹ️ No QR code available yet');
        setQrImage(null);
        return;
      }

      setQrGenerating(true);
      console.log('🎬 QR Generation Process Started');
      
      try {
        console.log('📊 QR String length:', qrCode.length);
        
        // Method 1: Try using online QR service (most reliable)
        console.log('🔄 Method 1: Using QR service API...');
        const encodedQR = encodeURIComponent(qrCode);
        const qrServiceUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedQR}`;
        
        try {
          const response = await fetch(qrServiceUrl);
          if (response.ok) {
            const blob = await response.blob();
            const dataUrl = URL.createObjectURL(blob);
            console.log('✅ QR generated using QR service');
            setQrImage(dataUrl);
            setQrGenerating(false);
            return;
          }
        } catch (serviceError) {
          console.warn('⚠️ QR service failed, trying library method...');
        }

        // Method 2: Try using installed qrcode library
        console.log('🔄 Method 2: Using qrcode library...');
        try {
          // First, try to load the library
          const QRCode = (await import('qrcode')).default;
          console.log('✅ QRCode library loaded successfully');
          
          const dataUrl = await QRCode.toDataURL(qrCode, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 300,
          });
          
          console.log('✅ QR code generated using library');
          setQrImage(dataUrl);
          setQrGenerating(false);
          return;
        } catch (libError) {
          console.warn('⚠️ QRCode library method failed:', libError.message);
        }

        // Method 3: Use canvas to draw QR (fallback)
        console.log('🔄 Method 3: Trying data URL approach...');
        // Create a simple base64 image fallback
        const simpleQRUrl = `https://quickchart.io/qr?text=${encodedQR}&size=300`;
        
        try {
          const checkResponse = await fetch(simpleQRUrl, { method: 'HEAD' });
          if (checkResponse.ok) {
            setQrImage(simpleQRUrl);
            console.log('✅ QR generated using quickchart');
            setQrGenerating(false);
            return;
          }
        } catch (e) {
          console.warn('⚠️ quickchart failed');
        }

        // If all methods fail
        throw new Error('All QR generation methods failed');

      } catch (error) {
        console.error('❌ QR generation failed:', error);
        console.error('Error details:', error.message);
        setQrImage(null);
        setQrGenerating(false);
      }
    };

    generateQR();
  }, [qrCode]);

  // Fetch QR code and status
  const fetchQRStatus = async () => {
    setLoading(true);
    setApiError(null);
    try {
      console.log('📡 Fetching QR status from API...');
      const response = await axiosInstance.get('/attendance/whatsapp/qr-status');
      
      console.log('✅ API Response received:', {
        hasQR: !!response.data.qr,
        qrLength: response.data.qr?.length,
        status: response.data.status,
        isReady: response.data.isReady,
      });
      
      setQrCode(response.data.qr || null);
      setStatus(response.data.status || 'initializing');
      setMessage(response.data.message || 'No message');
      setIsReady(response.data.isReady || false);

      if (!response.data.qr) {
        console.warn('⚠️ No QR code in response. Status:', response.data.status);
      }
    } catch (error) {
      console.error('❌ Error fetching QR status:', error);
      setApiError(error.message || 'Failed to fetch QR status');
      setStatus('error');
      setMessage('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchQRStatus();

    // Auto-refresh every 3 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing...');
        fetchQRStatus();
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [autoRefresh]);

  const fetchGatewayDevices = async () => {
    try {
      setDeviceLoading(true);
      const response = await axiosInstance.get('/calls/devices');
      const devices = response.data?.data || [];
      setGatewayDevices(devices);
      const drafts = {};
      devices.forEach((device) => {
        drafts[device.deviceId] = device.simNumber || '';
      });
      setSimDrafts(drafts);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to load gateway devices');
    } finally {
      setDeviceLoading(false);
    }
  };

  useEffect(() => {
    fetchGatewayDevices();
  }, []);

  const handleSimSave = async (deviceId) => {
    const simNumber = (simDrafts[deviceId] || '').trim();
    if (!simNumber) {
      toast.warning('Please enter school SIM number');
      return;
    }

    try {
      setDeviceSavingId(deviceId);
      await axiosInstance.put(`/calls/devices/${deviceId}/sim`, { simNumber });
      toast.success('School SIM number updated');
      fetchGatewayDevices();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to update SIM');
    } finally {
      setDeviceSavingId('');
    }
  };

  const handleCreateDevice = async () => {
    const deviceId = newDeviceId.trim();
    const simNumber = newSimNumber.trim();
    const deviceName = newDeviceName.trim();

    if (!deviceId || !simNumber) {
      toast.warning('Device ID and school SIM number are required');
      return;
    }

    try {
      setCreatingDevice(true);
      await axiosInstance.post('/calls/devices', {
        deviceId,
        deviceName,
        simNumber,
      });
      toast.success('Gateway device created and SIM saved');
      setNewDeviceId('');
      setNewDeviceName('');
      setNewSimNumber('');
      fetchGatewayDevices();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to create gateway device');
    } finally {
      setCreatingDevice(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'ready':
        return <span className="badge bg-success px-3 py-2">✅ Connected</span>;
      case 'waiting_scan':
        return <span className="badge bg-warning px-3 py-2">⏳ Waiting for scan...</span>;
      case 'scanned':
        return <span className="badge bg-info px-3 py-2">📱 Scanned - Authenticating...</span>;
      case 'error':
        return <span className="badge bg-danger px-3 py-2">❌ Error</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">⏳ Initializing...</span>;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'border-success';
      case 'waiting_scan':
        return 'border-warning';
      case 'error':
        return 'border-danger';
      default:
        return 'border-secondary';
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-3" style={{ borderColor: '#25D366' }}>
        <div className="card-header bg-success text-white d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FaWhatsapp size={28} className="me-3" />
            <h4 className="mb-0">WhatsApp Setup & Configuration</h4>
          </div>
          {getStatusBadge()}
        </div>

        <div className="card-body p-4">
          {/* API Error Alert */}
          {apiError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>❌ Connection Error:</strong> {apiError}
              <button
                type="button"
                className="btn-close"
                onClick={() => setApiError(null)}
              ></button>
            </div>
          )}

          {/* Status Section */}
          <div className={`alert alert-info border-3 ${getStatusColor()}`} role="alert">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h5 className="mb-2">
                  {status === 'ready' ? '✅ Status: Connected' : '⏳ Status: ' + status}
                </h5>
                <p className="mb-0">{message}</p>
              </div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={fetchQRStatus}
                disabled={loading}
              >
                <FaSync className={loading ? 'spinner-border' : ''} /> Refresh
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">📱 How to Scan</h5>
                </div>
                <div className="card-body">
                  <ol>
                    <li>Open <strong>WhatsApp</strong> on your phone</li>
                    <li>Go to <strong>Settings → Linked Devices</strong></li>
                    <li>Tap <strong>"Link a Device"</strong></li>
                    <li>Point camera at QR code on right</li>
                    <li>Wait for confirmation</li>
                  </ol>
                  <div className="mt-3">
                    <small className="text-muted">
                      ⚠️ Make sure WhatsApp is <strong>NOT</strong> open in web browser
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              {/* QR Code Display */}
              <div className="card border-success">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">🔐 QR Code to Scan</h5>
                </div>
                <div className="card-body text-center p-4" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {status === 'ready' && !qrImage ? (
                    <div className="alert alert-success w-100">
                      <h5>✅ Already Connected!</h5>
                      <p>WhatsApp is already set up and ready to send messages.</p>
                    </div>
                  ) : qrCode ? (
                    <div style={{ textAlign: 'center' }}>
                      {qrImage ? (
                        <div className="p-3 bg-white border-2 rounded" style={{ borderColor: '#25D366', display: 'inline-block' }}>
                          <img 
                            src={qrImage} 
                            alt="WhatsApp QR Code" 
                            style={{ width: '280px', height: '280px' }} 
                          />
                          <p className="mt-3 text-success mb-0">
                            <strong>☝️ Point your phone camera here</strong>
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="spinner-border text-success mb-3" role="status">
                            <span className="visually-hidden">Generating...</span>
                          </div>
                          <p className="text-muted">Generating QR Code...</p>
                          <p className="text-muted small">QR String Length: {qrCode.length} chars</p>
                        </div>
                      )}
                    </div>
                  ) : loading ? (
                    <div>
                      <div className="spinner-border text-success mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted">Fetching QR Code...</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted mb-3">
                        {status === 'ready'
                          ? '✅ WhatsApp is connected!'
                          : status === 'waiting_scan' ? '⏳ QR code will appear...' : 'QR code will appear here'}
                      </p>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={fetchQRStatus}
                      >
                        <FaSync /> Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Refresh Toggle */}
          <div className="mt-4 p-3 bg-light rounded">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="autoRefresh">
                <strong>Auto-refresh every 3 seconds</strong> (Turn off after scan completes)
              </label>
            </div>
          </div>

          {/* Connection Status Timeline */}
          <div className="mt-5 p-4 bg-light rounded">
            <h5 className="mb-4">📊 Connection Status Timeline</h5>
            <div className="row g-2">
              <div className="col-md-3 text-center">
                <div className={`badge px-3 py-2 w-100 ${status === 'initializing' ? 'bg-secondary' : 'bg-success'}`}>
                  1️⃣ Starting
                </div>
                <small className="d-block mt-2">Initializing...</small>
              </div>
              <div className="col-md-3 text-center">
                <div className={`badge px-3 py-2 w-100 ${status === 'waiting_scan' ? 'bg-warning' : status === 'ready' || status === 'scanned' ? 'bg-success' : 'bg-light'}`}>
                  2️⃣ Scan QR
                </div>
                <small className="d-block mt-2">Point camera</small>
              </div>
              <div className="col-md-3 text-center">
                <div className={`badge px-3 py-2 w-100 ${status === 'scanned' ? 'bg-info' : status === 'ready' ? 'bg-success' : 'bg-light'}`}>
                  3️⃣ Auth
                </div>
                <small className="d-block mt-2">Authenticating...</small>
              </div>
              <div className="col-md-3 text-center">
                <div className={`badge px-3 py-2 w-100 ${status === 'ready' ? 'bg-success' : 'bg-light'}`}>
                  4️⃣ Ready
                </div>
                <small className="d-block mt-2">✅ Connected!</small>
              </div>
            </div>
          </div>

          {/* Status Details */}
          <div className="mt-5 p-4 border rounded">
            <h5 className="mb-3">📋 Technical Details</h5>
            <dl className="row mb-0">
              <dt className="col-sm-3">Current Status:</dt>
              <dd className="col-sm-9">
                <code>{status}</code>
              </dd>

              <dt className="col-sm-3">Is Ready:</dt>
              <dd className="col-sm-9">
                <span className={isReady ? 'text-success' : 'text-warning'}>
                  {isReady ? '✅ Yes' : '⏳ No'}
                </span>
              </dd>

              <dt className="col-sm-3">Message:</dt>
              <dd className="col-sm-9">
                <small>{message}</small>
              </dd>

              <dt className="col-sm-3">Session Path:</dt>
              <dd className="col-sm-9">
                <small>.wapp_auth/</small>
              </dd>
            </dl>
          </div>

          {/* Gateway SIM Management */}
          <div className="mt-5 p-4 border rounded">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0">📞 School SIM Setup (Gateway Devices)</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={fetchGatewayDevices}
                disabled={deviceLoading}
              >
                <FaSync className={deviceLoading ? 'spinner-border spinner-border-sm' : ''} /> Refresh
              </button>
            </div>
            <p className="text-muted mb-3">
              Admin yahan se har Android gateway phone ka school SIM number set/update kar sakta hai.
            </p>

            <div className="card mb-3">
              <div className="card-body">
                <h6 className="mb-3">Add Gateway Device Manually</h6>
                <div className="row g-2">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Device ID (e.g. GATEWAY-01)"
                      value={newDeviceId}
                      onChange={(e) => setNewDeviceId(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Device Name (optional)"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="+91XXXXXXXXXX"
                      value={newSimNumber}
                      onChange={(e) => setNewSimNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-md-1 d-grid">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleCreateDevice}
                      disabled={creatingDevice}
                    >
                      {creatingDevice ? '...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {deviceLoading ? (
              <p className="text-muted mb-0">Loading gateway devices...</p>
            ) : gatewayDevices.length === 0 ? (
              <div className="alert alert-warning mb-0">
                No gateway device connected yet. First connect Android gateway app.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Device ID</th>
                      <th>Device Name</th>
                      <th>Status</th>
                      <th>School SIM Number</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gatewayDevices.map((device) => (
                      <tr key={device.deviceId}>
                        <td>{device.deviceId}</td>
                        <td>{device.deviceName || '-'}</td>
                        <td>
                          <span className={`badge ${device.isOnline ? 'bg-success' : 'bg-secondary'}`}>
                            {device.isOnline ? 'Online' : 'Offline'}
                          </span>{' '}
                          <span className={`badge ${device.isBusy ? 'bg-warning text-dark' : 'bg-primary'}`}>
                            {device.isBusy ? 'Busy' : 'Free'}
                          </span>
                        </td>
                        <td style={{ minWidth: '210px' }}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={simDrafts[device.deviceId] || ''}
                            onChange={(e) =>
                              setSimDrafts((prev) => ({ ...prev, [device.deviceId]: e.target.value }))
                            }
                            placeholder="+91XXXXXXXXXX"
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSimSave(device.deviceId)}
                            disabled={deviceSavingId === device.deviceId}
                          >
                            {deviceSavingId === device.deviceId ? 'Saving...' : 'Save SIM'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Help Section */}
          {status === 'error' && (
            <div className="alert alert-danger mt-4" role="alert">
              <h5>❌ Something went wrong</h5>
              <p>Try these steps:</p>
              <ul>
                <li>Refresh this page</li>
                <li>Restart the server</li>
                <li>Rescan the QR code</li>
                <li>Make sure WhatsApp is not open in a web browser</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default WhatsAppSettings;
