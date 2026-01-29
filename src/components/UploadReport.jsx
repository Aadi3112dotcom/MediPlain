export default function UploadReport() {
  return (
    <div className="card">
      <h3>Upload Medical Report</h3>
      <input type="file" />
      <p className="hint">
        Upload blood tests, prescriptions, scans, or discharge summaries.
      </p>
    </div>
  );
}
