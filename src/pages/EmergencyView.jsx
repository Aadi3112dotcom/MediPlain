import React from "react";
import "./EmergencyView.css";

export default function EmergencyView({ healthData }) {
  return (
    <div className="emergency-view-container">
      {/* Header */}
      <div className="emergency-header">
        <div className="emergency-icon">🚨</div>
        <h1>EMERGENCY HEALTH INFO</h1>
        <p>Quick Access - No Authentication Required</p>
      </div>

      {/* Main Content */}
      <div className="emergency-content">
        {/* Patient Name */}
        <div className="emergency-section patient-section">
          <div className="section-title">Patient Name</div>
          <div className="patient-name">{healthData.name}</div>
        </div>

        {/* Blood Group - Highlighted */}
        <div className="emergency-section blood-group-section">
          <div className="section-title">Blood Group</div>
          <div className="blood-group-badge">{healthData.bloodGroup}</div>
        </div>

        {/* Age */}
        <div className="emergency-section age-section">
          <div className="section-title">Age</div>
          <div className="emergency-data">{healthData.age} years</div>
        </div>

        {/* Last Visit */}
        <div className="emergency-section visit-section">
          <div className="section-title">Last Medical Visit</div>
          <div className="emergency-data">{healthData.lastVisit}</div>
        </div>

        {/* Allergies */}
        <div className="emergency-section allergies-section">
          <div className="section-title">⚠️ ALLERGIES</div>
          <div className="badges-container">
            {healthData.allergies && healthData.allergies.length > 0 ? (
              healthData.allergies.map((allergy, index) => (
                <span key={index} className="allergy-badge">
                  {allergy}
                </span>
              ))
            ) : (
              <div className="no-data">No allergies recorded</div>
            )}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="emergency-section conditions-section">
          <div className="section-title">Chronic Conditions</div>
          <div className="badges-container">
            {healthData.chronicConditions && healthData.chronicConditions.length > 0 ? (
              healthData.chronicConditions.map((condition, index) => (
                <span key={index} className="condition-badge">
                  {condition}
                </span>
              ))
            ) : (
              <div className="no-data">No chronic conditions recorded</div>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="emergency-section medications-section">
          <div className="section-title">Current Medications</div>
          <div className="badges-container">
            {healthData.medications && healthData.medications.length > 0 ? (
              healthData.medications.map((medication, index) => (
                <span key={index} className="medication-badge">
                  {medication}
                </span>
              ))
            ) : (
              <div className="no-data">No medications recorded</div>
            )}
          </div>
        </div>

        {/* Last Report */}
        <div className="emergency-section report-section">
          <div className="section-title">Latest Medical Report</div>
          <div className="emergency-data">{healthData.lastReport}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="emergency-footer">
        <p>📱 This information was accessed via QR code</p>
        <p className="timestamp">Generated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
