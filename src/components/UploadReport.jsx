import { useState } from "react";
import { processReportImage, parsemedicalReport } from "../utils/ocr";
import { uploadMedicalReport } from "../services/firebaseService";
import toast from 'react-hot-toast';
import "./UploadReport.css";

export default function UploadReport({ extractedText, setExtractedText, healthData }) {
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const processFile = async (file) => {
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);
    setUploadSuccess(false);

    try {
      const result = await processReportImage(file);
      
      setExtractedText(result.text);
      setParsedData(result.parsed);
      
      // Try to upload to Firebase if patient ID is available
      if (healthData?.id) {
        try {
          await uploadMedicalReport(healthData.id, file, {
            extractedText: result.text,
            parsedData: result.parsed
          });
          toast.success('Report uploaded and analyzed!');
        } catch (uploadError) {
          console.warn('Firebase upload failed, but OCR succeeded:', uploadError);
          toast.success('Report analyzed successfully!');
        }
      } else {
        toast.success('Report analyzed successfully!');
      }
      
      setUploadSuccess(true);
      
      // Show success message
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Failed to process image. Please try another file.");
      setExtractedText("Error: Could not extract text from image. Please try another file.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Text copied to clipboard!');
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "extracted_medical_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearText = () => {
    setExtractedText("");
    setFileName(null);
  };

  return (
    <div className="card upload-card">
      <div className="card-header">
        <span className="card-icon">📄</span>
        <h3>Upload Medical Report</h3>
      </div>

      {uploadSuccess && (
        <div className="success-message">
          ✅ File uploaded successfully! Text extracted.
        </div>
      )}

      <div
        className={`upload-area ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="file-input"
          accept="image/*,.pdf"
          disabled={isProcessing}
        />
        <label htmlFor="file-input" className="upload-label">
          <span className="upload-icon">⬆️</span>
          <p>Drag & drop your file or click to browse</p>
          <span className="file-types">PDF, JPG, PNG, or DOCX</span>
        </label>
      </div>

      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Processing: {progress}%</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {fileName && !isProcessing && (
        <div className="file-info">
          <span className="file-icon">✓</span>
          <p>{fileName}</p>
        </div>
      )}

      {extractedText && !isProcessing && (
        <div className="ocr-results">
          <div className="results-header">
            <h4>📝 Extracted Text</h4>
            <div className="results-actions">
              <button className="action-btn copy-btn" onClick={copyToClipboard}>
                📋 Copy
              </button>
              <button className="action-btn download-btn" onClick={downloadText}>
                ⬇️ Download
              </button>
              <button className="action-btn clear-btn" onClick={clearText}>
                🗑️ Clear
              </button>
            </div>
          </div>
          <div className="extracted-text">
            {extractedText}
          </div>
        </div>
      )}

      <p className="hint">
        📋 Upload blood tests, prescriptions, scans, or discharge summaries. OCR technology automatically extracts text from your documents.
      </p>
      <button className="upload-btn" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Upload Report"}
      </button>
    </div>
  );
}
