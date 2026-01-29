export default function QRAccess() {
  const emergencyURL = "https://example.com/emergency";

  return (
    <div className="card center">
      <h3>Emergency QR Access</h3>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
          emergencyURL
        )}`}
        alt="Emergency QR"
      />

      <p className="hint">
        Scan to access critical health data (no login required)
      </p>
    </div>
  );
}
