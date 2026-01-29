import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'mediaplain-secret-key-2026';

/**
 * Encrypt sensitive data
 */
export const encryptData = (data) => {
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypt encrypted data
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Create time-bound token for QR access
 */
export const createTimeBoundToken = (data, expirationMinutes = 30) => {
  const expirationTime = new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString();
  const tokenData = {
    ...data,
    expiresAt: expirationTime,
    createdAt: new Date().toISOString()
  };
  
  return encryptData(tokenData);
};

/**
 * Verify time-bound token
 */
export const verifyTimeBoundToken = (token) => {
  try {
    const data = decryptData(token);
    if (!data || !data.expiresAt) return null;
    
    const expirationTime = new Date(data.expiresAt);
    if (new Date() > expirationTime) {
      console.warn('Token has expired');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

/**
 * Hash sensitive data for verification
 */
export const hashData = (data) => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  return CryptoJS.SHA256(stringData).toString();
};
