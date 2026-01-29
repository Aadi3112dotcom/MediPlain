import QRCode from 'qrcode';
import { createTimeBoundToken } from './encryption';

/**
 * Generate QR code for patient emergency access
 */
export const generateEmergencyQR = async (patientData, expirationMinutes = 30) => {
  try {
    const token = createTimeBoundToken(patientData, expirationMinutes);
    
    // Create QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return {
      token,
      qrCode: qrCodeDataUrl,
      expiresAt: new Date(Date.now() + expirationMinutes * 60 * 1000),
      createdAt: new Date()
    };
  } catch (error) {
    console.error('QR code generation error:', error);
    throw error;
  }
};

/**
 * Generate QR code canvas element
 */
export const generateQRCanvas = async (data) => {
  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300
    });
    return canvas;
  } catch (error) {
    console.error('QR canvas generation error:', error);
    throw error;
  }
};

/**
 * Download QR code as image
 */
export const downloadQRCode = async (qrCodeDataUrl, filename = 'emergency-access.png') => {
  try {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error('QR code download error:', error);
    throw error;
  }
};
