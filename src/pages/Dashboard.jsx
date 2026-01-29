import UploadReport from "../components/UploadReport";
import ExplainReport from "../components/ExplainReport";
import HealthSummary from "../components/HealthSummary";
import QRAccess from "../components/QRAccess";
import "./Dashboard.css";

export default function Dashboard({ extractedText, setExtractedText, healthData, setHealthData }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {healthData.name}!</h1>
        <p>Manage your health records securely in one place</p>
      </div>

      <div className="dashboard-grid">
        <div className="grid-col-1">
          <UploadReport 
            extractedText={extractedText}
            setExtractedText={setExtractedText}
            healthData={healthData}
          />
          <ExplainReport 
            extractedText={extractedText}
            healthData={healthData}
          />
        </div>
        <div className="grid-col-2">
          <HealthSummary 
            healthData={healthData}
            setHealthData={setHealthData}
          />
          <QRAccess healthData={healthData} />
        </div>
      </div>
    </div>
  );
}
