import UploadReport from "../components/UploadReport";
import ExplainReport from "../components/ExplainReport";
import HealthSummary from "../components/HealthSummary";
import QRAccess from "../components/QRAccess";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <UploadReport />
      <ExplainReport />
      <HealthSummary />
      <QRAccess />
    </div>
  );
}
