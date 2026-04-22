import React, { useState } from 'react';

const QRCodeTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState(null);

  const testQRGeneration = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('📋 Step 1: Testing qrcode library import...');
      const QRCode = (await import('qrcode')).default;
      console.log('✅ QRCode library imported successfully');
      setTestResult(prev => (prev || '') + '✅ QRCode library imported\n');

      console.log('📋 Step 2: Testing QR generation with sample data...');
      const testData = '2@PFT/i6TZuPYO0WYmNYRscrT/Gvdh5ZONGFPlNjQcV4mw416wBDt9ewrkizitwCtUffgUjYIn9uLMkYw3mo3YhtZSN99rMVfpv38=,1hfilBaJ9V9/nmYNatWr2OfohEBDoANBSA5B0slZaS0=,b1h4yp0dIXfvW4RnRaP0pLCJYjggtrnrHc0qYAENVHc=';
      
      const dataUrl = await QRCode.toDataURL(testData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      });
      
      console.log('✅ QR code generated successfully');
      console.log('📊 Data URL length:', dataUrl.length);
      console.log('📊 Data URL preview:', dataUrl.substring(0, 100) + '...');
      
      setTestResult(prev => (prev || '') + `✅ QR generated (${dataUrl.length} bytes)\n`);
      setGeneratedQR(dataUrl);
    } catch (error) {
      console.error('❌ Error in QR generation test:', error);
      setTestResult(`❌ Error: ${error.message}\n${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">🧪 QR Code Generation Test</h4>
        </div>
        <div className="card-body">
          <button 
            onClick={testQRGeneration}
            disabled={loading}
            className="btn btn-primary mb-3"
          >
            {loading ? 'Testing...' : 'Test QR Generation'}
          </button>

          {testResult && (
            <div className="card mt-3 bg-light">
              <div className="card-body">
                <h5>Test Results:</h5>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {testResult}
                </pre>
              </div>
            </div>
          )}

          {generatedQR && (
            <div className="card mt-3">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Generated QR Code</h5>
              </div>
              <div className="card-body text-center">
                <img 
                  src={generatedQR}
                  alt="Test QR Code"
                  style={{ width: '280px', height: '280px', border: '2px solid #25D366', padding: '10px' }}
                />
                <p className="mt-3 text-success">✅ QR code rendered successfully!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeTest;
