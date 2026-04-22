/**
 * QR Code Utilities
 * Provides reliable QR code generation with fallbacks
 */

/**
 * Generate QR code data URL
 * @param {string} qrString - The QR code string to encode
 * @returns {Promise<string|null>} - Data URL or null if failed
 */
export const generateQRCodeDataURL = async (qrString) => {
  if (!qrString) {
    console.warn('❌ QR string is empty');
    return null;
  }

  try {
    console.log('🔄 Step 1: Importing qrcode library...');
    const QRCode = (await import('qrcode')).default;
    
    console.log('🔄 Step 2: Generating QR data URL...');
    const dataUrl = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    
    console.log('✅ Step 3: QR code generated successfully');
    return dataUrl;
  } catch (error) {
    console.error('❌ Error in QR generation:', error);
    console.error('QR String preview:', qrString?.substring(0, 50) + '...');
    return null;
  }
};

/**
 * Validate QR string format
 * @param {string} qrString - The QR code string to validate
 * @returns {boolean} - True if valid
 */
export const isValidQRString = (qrString) => {
  if (!qrString) return false;
  if (typeof qrString !== 'string') return false;
  if (qrString.length < 50) return false; // QR codes are typically long
  return true;
};
