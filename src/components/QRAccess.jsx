import { useState, useEffect } from "react";
import Modal from "./Modal";
import { generateEmergencyQR, downloadQRCode } from "../utils/qrCode";
import { getEmergencySummary } from "../services/aiService";
import toast from 'react-hot-toast';
import "./QRAccess.css";

export default function QRAccess({ healthData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [emergencyURL, setEmergencyURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [emergencySummary, setEmergencySummary] = useState(null);
  const [expirationTime, setExpirationTime] = useState(30);

  // Initialize emergency URL
  useEffect(() => {
    const url = `${window.location.origin}/emergency/${healthData?.id || 'patient-1'}`;
    setEmergencyURL(url);
  }, [healthData]);

  const generateNewQR = async () => {
    setLoading(true);
    try {
      const qrData = await generateEmergencyQR(healthData || {}, expirationTime);
      setQrCode(qrData);
      
      // Get emergency summary from AI
      try {
        const summary = await getEmergencySummary(healthData || {});
        setEmergencySummary(summary);
      } catch (error) {
        console.warn('Could not generate AI summary:', error);
      }
      
      toast.success('Emergency QR code generated!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Emergency Medical Access",
          text: "Scan this QR code to access my critical health data",
          url: emergencyURL
        });
        toast.success('Shared successfully!');
      } catch (err) {
        console.log("Error sharing:", err);
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(emergencyURL);
          toast.success('Link copied to clipboard!');
        }
      }
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(emergencyURL);
      toast.success('Emergency link copied to clipboard!');
    }
  };

  const handleDownloadQR = async () => {
    try {
      if (qrCode?.qrCode) {
        await downloadQRCode(qrCode.qrCode, `emergency-qr-${Date.now()}.png`);
        toast.success('QR code downloaded!');
      } else {
        toast.error('Generate a QR code first');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  const printQR = () => {
    if (!qrCode?.qrCode) {
      toast.error('Generate a QR code first');
      return;
    }

    const printWindow = window.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Emergency Medical QR Code</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: white;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              padding: 20px;
            }
            h1 {
              color: #667eea;
              margin-bottom: 20px;
            }
            img {
              max-width: 400px;
              border: 2px solid #667eea;
              padding: 10px;
            }
            p {
              margin-top: 20px;
              color: #555;
              font-size: 16px;
            }
            .expiry {
              font-size: 12px;
              color: #999;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🆘 Emergency Medical Access</h1>
            <img src="${qrCode.qrCode}" alt="Emergency QR Code" />
            <p>Scan this code to access critical health data</p>
            <p class="expiry">Expires: ${qrCode.expiresAt?.toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <>
      <div className="card qr-card center">
        <div className="card-header-center">
          <span className="card-icon">🆘</span>
          <h3>Emergency QR Access</h3>
        </div>

        <p className="qr-description">
          First responders can instantly access your critical health data
        </p>

        <div className="expiration-selector">
          <label>QR Code Expiration:</label>
          <select 
            value={expirationTime} 
            onChange={(e) => setExpirationTime(parseInt(e.target.value))}
            disabled={loading}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={480}>8 hours</option>
            <option value={1440}>24 hours</option>
          </select>
        </div>

        <button 
          className="generate-qr-btn" 
          onClick={generateNewQR}
          disabled={loading}
        >
          {loading ? '⏳ Generating...' : '🔄 Generate QR Code'}
        </button>

        {qrCode && (
          <>
            <div className="qr-container">
              <img
                src={qrCode.qrCode}
                alt="Emergency QR Code"
                className="qr-code"
              />
            </div>

            <div className="qr-info">
              <p><small>🔐 Encrypted | ⏰ Expires: {qrCode.expiresAt?.toLocaleString()}</small></p>
            </div>

            {emergencySummary && (
              <div className="emergency-summary">
                <strong>Critical Info:</strong>
                <ul>
                  {emergencySummary.criticalInfo?.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="security-info">
              <span className="security-icon">🔒</span>
              <p>
                <strong>Encrypted & Time-Bound:</strong> Your data is encrypted with AES-256 and expires automatically. First responders need no login.
              </p>
            </div>

            <div className="qr-actions">
              <button className="qr-action-btn download-btn" onClick={handleDownloadQR}>
                ⬇️ Download
              </button>
              <button className="qr-action-btn print-btn" onClick={printQR}>
                🖨️ Print
              </button>
              <button className="qr-btn" onClick={handleShare}>
                📤 Share Access
              </button>
            </div>
          </>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="🆘 Share Emergency Access"
      >
        <div className="share-modal">
          <p>Share your emergency medical QR code with trusted contacts or authorities:</p>
          
          <div className="share-options">
            <button className="share-option-btn" onClick={handleShare}>
              <span className="share-icon">📤</span>
              <span>Share Link</span>
            </button>
            <button className="share-option-btn" onClick={() => {
              navigator.clipboard.writeText(emergencyURL);
              alert("✅ Link copied!");
            }}>
              <span className="share-icon">📋</span>
              <span>Copy Link</span>
            </button>
            <button className="share-option-btn" onClick={downloadQR}>
              <span className="share-icon">⬇️</span>
              <span>Download QR</span>
            </button>
            <button className="share-option-btn" onClick={printQR}>
              <span className="share-icon">🖨️</span>
              <span>Print QR</span>
            </button>
          </div>

          <div className="emergency-contacts">
            <h4>📞 Emergency Contacts</h4>
            <p>You can share this QR code with:</p>
            <ul>
              <li>Emergency responders (Police, Ambulance, Hospital)</li>
              <li>Close family members or guardians</li>
              <li>Your primary care physician</li>
              <li>Emergency medical services</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button className="modal-btn modal-btn-primary" onClick={() => setIsModalOpen(false)}>
              Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
