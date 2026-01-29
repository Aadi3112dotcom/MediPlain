import { useState } from "react";
import Calendar from "react-calendar";
import Modal from "./Modal";
import "react-calendar/dist/Calendar.css";
import "./HealthSummary.css";

export default function HealthSummary({ healthData, setHealthData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState(healthData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    const dateStr = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
    setFormData({
      ...formData,
      lastVisit: dateStr
    });
    setShowCalendar(false);
  };

  const handleAddAllergy = () => {
    const input = prompt("Enter new allergy:");
    if (input && !formData.allergies.includes(input)) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, input]
      });
    }
  };

  const handleRemoveAllergy = (idx) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== idx)
    });
  };

  const handleSave = () => {
    setHealthData(formData);
    setIsModalOpen(false);
    alert("✅ Health information updated successfully!");
  };

  return (
    <>
      <div className="card health-card">
        <div className="card-header">
          <span className="card-icon">❤️</span>
          <h3>Emergency Health Summary</h3>
        </div>

        <div className="patient-info">
          <div className="info-box">
            <span className="info-label">Name</span>
            <span className="info-value">{healthData.name}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Blood Group</span>
            <span className="info-value blood-group">{healthData.bloodGroup}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Age</span>
            <span className="info-value">{healthData.age}</span>
          </div>
          <div className="info-box">
            <span className="info-label">Last Visit</span>
            <span className="info-value">{healthData.lastVisit}</span>
          </div>
        </div>

        <div className="health-details">
          <div className="detail-section">
            <h4>⚠️ Allergies</h4>
            <div className="detail-list">
              {healthData.allergies.map((allergy, idx) => (
                <span key={idx} className="detail-badge allergy-badge">{allergy}</span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h4>🏥 Chronic Conditions</h4>
            <div className="detail-list">
              {healthData.chronicConditions.map((condition, idx) => (
                <span key={idx} className="detail-badge condition-badge">{condition}</span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h4>💊 Current Medications</h4>
            <div className="detail-list">
              {healthData.medications.map((med, idx) => (
                <span key={idx} className="detail-badge med-badge">{med}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="last-report">
          <span className="report-icon">📊</span>
          <div>
            <p className="report-label">Latest Report</p>
            <p className="report-name">{healthData.lastReport}</p>
          </div>
        </div>

        <button className="edit-btn" onClick={() => setIsModalOpen(true)}>
          ✏️ Edit Health Info
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit Health Information"
      >
        <div className="edit-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select 
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input 
              type="number" 
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
            />
          </div>

          <div className="form-group">
            <label>Last Visit</label>
            <div className="date-input-group">
              <input 
                type="text" 
                name="lastVisit"
                value={formData.lastVisit}
                readOnly
                placeholder="Select a date"
              />
              <button 
                type="button"
                className="calendar-btn"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                📅
              </button>
            </div>
            {showCalendar && (
              <div className="calendar-inline">
                <Calendar 
                  onChange={handleDateChange}
                  value={new Date(formData.lastVisit)}
                  maxDate={new Date()}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Allergies</label>
            <div className="allergen-list">
              {formData.allergies.map((allergy, idx) => (
                <span key={idx} className="allergen-tag">
                  {allergy}
                  <button 
                    type="button"
                    className="remove-allergen"
                    onClick={() => handleRemoveAllergy(idx)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <button 
              type="button"
              className="add-btn"
              onClick={handleAddAllergy}
            >
              + Add Allergy
            </button>
          </div>

          <div className="form-group">
            <label>Last Report</label>
            <input 
              type="text" 
              name="lastReport"
              value={formData.lastReport}
              onChange={handleInputChange}
              placeholder="e.g., Blood Test (Jan 2026)"
            />
          </div>

          <div className="modal-actions">
            <button className="modal-btn modal-btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="modal-btn modal-btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
