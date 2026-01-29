import { useState } from 'react';
import QRCode from 'qrcode.react';
import './App.css';

// Patient Health Summary Component
function HealthSummary({ patient, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(patient);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergiesChange = (e) => {
    const allergies = e.target.value.split(',').map(a => a.trim());
    setFormData(prev => ({
      ...prev,
      allergies
    }));
  };

  const handleMedicationsChange = (e) => {
    const medications = e.target.value.split(',').map(m => m.trim());
    setFormData(prev => ({
      ...prev,
      medications
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    alert('✅ Patient profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData(patient);
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="header-with-button">
          <h2>👤 Patient Profile</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-btn ${isEditing ? 'cancel' : ''}`}
          >
            {isEditing ? '❌ Cancel' : '✏️ Edit'}
          </button>
        </div>
      </div>

      {!isEditing ? (
        <div className="patient-details">
          <div className="detail">
            <span className="label">Name:</span>
            <span className="value">{patient.name}</span>
          </div>
          <div className="detail">
            <span className="label">Age:</span>
            <span className="value">{patient.age} years</span>
          </div>
          <div className="detail">
            <span className="label">Blood Group:</span>
            <span className="value blood-group">{patient.bloodGroup}</span>
          </div>
          <div className="detail">
            <span className="label">Allergies:</span>
            <div className="allergies">
              {patient.allergies.map((allergy, i) => (
                <span key={i} className="allergy-badge">{allergy}</span>
              ))}
            </div>
          </div>
          <div className="detail">
            <span className="label">Emergency Contact:</span>
            <span className="value">{patient.emergencyContact}</span>
          </div>
          <div className="detail">
            <span className="label">Medications:</span>
            <div className="allergies">
              {patient.medications.map((med, i) => (
                <span key={i} className="medication-badge">{med}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="edit-form">
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Age:</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Blood Group:</label>
            <select 
              name="bloodGroup" 
              value={formData.bloodGroup}
              onChange={handleInputChange}
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Allergies (comma separated):</label>
            <input 
              type="text" 
              value={formData.allergies.join(', ')}
              onChange={handleAllergiesChange}
              placeholder="Penicillin, Shellfish"
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact:</label>
            <input 
              type="tel" 
              name="emergencyContact" 
              value={formData.emergencyContact}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Medications (comma separated):</label>
            <input 
              type="text" 
              value={formData.medications.join(', ')}
              onChange={handleMedicationsChange}
              placeholder="Aspirin 500mg, Vitamin D 1000IU"
            />
          </div>

          <div className="form-buttons">
            <button onClick={handleSave} className="save-btn">💾 Save Changes</button>
            <button onClick={handleCancel} className="cancel-btn">❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Upload Report Component
function UploadReport({ onReportUpload }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      
      // Handle different file types
      if (file.type.startsWith('image/')) {
        // For images, read as data URL for display
        reader.onload = (event) => {
          // Pass a simple message that can trigger OCR detection
          const mockOCRText = `
Medical Report - Image Upload
Patient underwent tests including:
- Blood examination
- Lab work
- Clinical assessment

Note: Image upload requires OCR processing to extract text.
Please upload text or PDF reports for better analysis.
          `;
          onReportUpload(mockOCRText);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For PDF, read as text (basic handling)
        reader.onload = (event) => {
          onReportUpload(event.target.result);
        };
        reader.readAsText(file);
      } else {
        // For text files, read as text
        reader.onload = (event) => {
          onReportUpload(event.target.result);
        };
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📄 Upload Medical Report</h2>
      </div>
      <div className="upload-section">
        <input
          type="file"
          accept=".txt,.pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-button">
          📁 Choose Report File
        </label>
        {fileName && <p className="file-name">Selected: {fileName}</p>}
        <p className="hint">Upload text, PDF, PNG, or JPG reports for analysis</p>
      </div>
    </div>
  );
}

// Explain Report Component
function ExplainReport({ reportText }) {
  const [explanation, setExplanation] = useState('');

  const handleExplain = () => {
    if (!reportText) {
      alert('Please upload a report first');
      return;
    }

    // Convert to lowercase for detection
    const reportLower = reportText.toLowerCase();
    
    // Dictionary of diseases with keywords
    const diseaseDatabase = {
      'diabetes': {
        keywords: ['diabetes', 'glucose', 'blood sugar', 'fasting sugar', 'hba1c', 'diabetic'],
        name: '🍬 DIABETES',
        simple: 'Your body cannot control sugar levels properly',
        impact: 'High sugar in blood can damage your eyes, kidneys, and heart',
        care: `
  ✓ Eat foods without sugar (vegetables, fruits, eggs, fish)
  ✓ Avoid sugary drinks and desserts
  ✓ Exercise 30 minutes daily
  ✓ Take prescribed medicine regularly
  ✓ Check blood sugar regularly
  ✓ Sleep well and reduce stress`
      },
      'hypertension': {
        keywords: ['hypertension', 'high blood pressure', 'bp high', 'systolic', 'diastolic elevated'],
        name: '⬆️ HIGH BLOOD PRESSURE',
        simple: 'Your blood is pushing too hard on your vessel walls',
        impact: 'Can lead to heart attack or stroke if not controlled',
        care: `
  ✓ Reduce salt in your food
  ✓ Eat less oily and fried food
  ✓ Exercise daily (walking, yoga)
  ✓ Take prescribed medicine
  ✓ Manage stress through meditation
  ✓ Limit caffeine and alcohol`
      },
      'cholesterol': {
        keywords: ['cholesterol', 'high cholesterol', 'ldl high', 'triglycerides high', 'lipid'],
        name: '🧈 HIGH CHOLESTEROL',
        simple: 'Too much fat is building up in your blood vessels',
        impact: 'Can block blood flow to your heart and brain',
        care: `
  ✓ Eat less meat and dairy
  ✓ Choose olive oil instead of butter
  ✓ Eat more fruits, vegetables, fish
  ✓ Exercise 30 minutes daily
  ✓ Take prescribed medicine
  ✓ Avoid junk food`
      },
      'thyroid': {
        keywords: ['thyroid', 'tsh', 'hypothyroidism', 'hyperthyroidism', 't3', 't4'],
        name: '🦋 THYROID ISSUE',
        simple: 'Your thyroid gland is not working properly',
        impact: 'Affects your metabolism, energy, and weight',
        care: `
  ✓ Take prescribed thyroid medicine regularly
  ✓ Eat iodine-rich food (salt, seafood, eggs)
  ✓ Avoid stress
  ✓ Get regular check-ups
  ✓ Sleep 7-8 hours daily
  ✓ Exercise moderately`
      },
      'anemia': {
        keywords: ['anemia', 'hemoglobin low', 'hb low', 'iron deficiency', 'red blood cells low'],
        name: '🩸 ANEMIA (Low Iron)',
        simple: 'You don\'t have enough healthy red blood cells',
        impact: 'You feel tired, weak, and may have shortness of breath',
        care: `
  ✓ Eat iron-rich foods (spinach, chicken, eggs, beans)
  ✓ Drink orange juice with iron-rich food (helps absorption)
  ✓ Take iron supplements if prescribed
  ✓ Rest well and sleep properly
  ✓ Avoid stress
  ✓ Get regular blood tests`
      },
      'asthma': {
        keywords: ['asthma', 'bronchial', 'breathing difficulty', 'wheezing', 'respiratory'],
        name: '😤 ASTHMA',
        simple: 'Your airways get narrow making it hard to breathe',
        impact: 'Can cause sudden difficulty breathing',
        care: `
  ✓ Use inhaler as prescribed
  ✓ Avoid pollution and smoke
  ✓ Keep your home clean
  ✓ Regular gentle exercise
  ✓ Manage allergies
  ✓ Have your inhaler always with you`
      },
      'depression': {
        keywords: ['depression', 'depressed', 'mental health', 'sad', 'hopeless'],
        name: '💙 DEPRESSION',
        simple: 'Your mind is feeling very sad and hopeless',
        impact: 'Affects sleep, energy, eating, and happiness',
        care: `
  ✓ Take prescribed medicine
  ✓ Talk to a counselor or therapist
  ✓ Do activities you enjoy
  ✓ Stay connected with family and friends
  ✓ Exercise and spend time in nature
  ✓ Call helpline when feeling bad: 9152987821`
      },
      'anxiety': {
        keywords: ['anxiety', 'panic attack', 'anxious', 'worried', 'stress disorder'],
        name: '😰 ANXIETY',
        simple: 'You feel very worried or scared about things',
        impact: 'Can cause panic attacks and physical symptoms',
        care: `
  ✓ Practice deep breathing exercises
  ✓ Take prescribed medicine
  ✓ Talk to a therapist
  ✓ Meditate and do yoga
  ✓ Limit caffeine and alcohol
  ✓ Sleep well and exercise`
      },
      'arthritis': {
        keywords: ['arthritis', 'joint pain', 'joint inflammation', 'rheumatoid', 'osteoarthritis'],
        name: '🦴 ARTHRITIS (Joint Pain)',
        simple: 'Your joints are swollen and painful',
        impact: 'Makes movement difficult and causes chronic pain',
        care: `
  ✓ Do gentle exercises
  ✓ Use hot/cold therapy on joints
  ✓ Take prescribed pain medicine
  ✓ Eat anti-inflammatory foods
  ✓ Maintain healthy weight
  ✓ Rest when needed`
      },
      'covid': {
        keywords: ['covid', 'corona', 'sars-cov-2', 'coronavirus', 'covid-19'],
        name: '🦠 COVID-19',
        simple: 'You have a viral infection from coronavirus',
        impact: 'Can range from mild to severe breathing problems',
        care: `
  ✓ Rest at home
  ✓ Stay hydrated
  ✓ Isolate from others
  ✓ Monitor oxygen levels if needed
  ✓ Take paracetamol for fever
  ✓ Seek hospital if breathlessness worsens`
      },
      'hypertension': {
        keywords: ['hypertension', 'high bp', 'elevated blood pressure'],
        name: '⬆️ HIGH BLOOD PRESSURE',
        simple: 'Your blood is pushing too hard on your vessel walls',
        impact: 'Can lead to heart attack or stroke if not controlled',
        care: `
  ✓ Reduce salt in your food
  ✓ Eat less oily and fried food
  ✓ Exercise daily (walking, yoga)
  ✓ Take prescribed medicine
  ✓ Manage stress through meditation
  ✓ Limit caffeine and alcohol`
      }
    };

    // Find diseases mentioned in the report
    let detectedDiseases = [];

    for (const [key, disease] of Object.entries(diseaseDatabase)) {
      for (const keyword of disease.keywords) {
        if (reportLower.includes(keyword)) {
          // Avoid duplicates
          if (!detectedDiseases.some(d => d.name === disease.name)) {
            detectedDiseases.push(disease);
          }
          break;
        }
      }
    }

    // Extract first 400 characters of the report
    const extractedInfo = reportText.substring(0, 400);

    // Build explanations for detected diseases
    let detailedExplanations = '';

    if (detectedDiseases.length > 0) {
      detailedExplanations = detectedDiseases.map((disease, idx) => `
📌 CONDITION ${idx + 1}: ${disease.name}

What does this mean?
${disease.simple}

Why is this important?
${disease.impact}

How to take care of yourself:
${disease.care}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`).join('\n');
    } else {
      detailedExplanations = `
📌 YOUR REPORT

Your report was reviewed, but specific disease keywords were not clearly detected.

Your report might show:
  • Lab test values and measurements
  • Doctor's observations
  • Clinical findings
  • Test results analysis

💡 WHAT TO DO:
  1. Share this report with your doctor
  2. Ask them to explain what each value means
  3. Ask if you need any specific treatment
  4. Discuss lifestyle changes if recommended
  5. Schedule follow-up if needed`;
    }

    const simpleExplanation = `
📋 YOUR MEDICAL REPORT - EXPLAINED IN SIMPLE WORDS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💙 I ANALYZED YOUR REPORT AND HERE'S WHAT I FOUND:
${detectedDiseases.length > 0 ? `✓ Found ${detectedDiseases.length} condition(s) mentioned in your report` : '✓ This is a medical test report'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 PART OF YOUR REPORT:
${extractedInfo}
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${detailedExplanations}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 YOU'RE TAKING THE RIGHT STEP:
Getting your health checked and understanding your report 
is a brave and smart decision! Many people are in similar situations.

Don't feel alone - you have support! 💪

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 IMPORTANT ACTION STEPS:
1. ✓ Read this explanation carefully
2. ✓ Write down questions for your doctor
3. ✓ Book an appointment with your doctor
4. ✓ Show this report to your doctor
5. ✓ Follow the prescribed treatment
6. ✓ Take medicines on time
7. ✓ Do follow-up tests as advised

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 EMERGENCY CONTACTS:
If you feel very unwell = CALL 108 (Ambulance)
Mental health crisis = CALL 9152987821
Poison/Drug Overdose = CALL 1800-228-6633

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ REMEMBER:
Your health journey matters. Be kind to yourself! 💙
    `;

    setExplanation(simpleExplanation);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>💙 Empathetic Report Explanation</h2>
      </div>
      <button onClick={handleExplain} className="explain-button">
        🤖 Help Me Understand My Report
      </button>
      {explanation && (
        <div className="explanation">
          <pre>{explanation}</pre>
        </div>
      )}
    </div>
  );
}

// QR Code Component
function QRAccess({ patient }) {
  const qrValue = JSON.stringify({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    bloodGroup: patient.bloodGroup,
    allergies: patient.allergies,
    emergencyContact: patient.emergencyContact,
    medicalHistory: patient.medicalHistory,
    medications: patient.medications,
    timestamp: new Date().toISOString()
  });

  const downloadQR = () => {
    const qrCanvas = document.querySelector('canvas');
    const url = qrCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patient.name}-QR-${patient.id}.png`;
    link.click();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>📱 Emergency QR Code</h2>
      </div>
      <div className="qr-section">
        <p className="patient-id">🆔 Patient ID: <strong>{patient.id}</strong></p>
        <div className="qr-container">
          <div className="qr-box">
            <QRCode 
              value={qrValue} 
              size={200}
              level="H"
              includeMargin={true}
              renderAs="canvas"
            />
          </div>
        </div>
        <button onClick={downloadQR} className="download-btn">
          ⬇️ Download QR Code
        </button>
        <div className="qr-info">
          <p className="hint">📋 Encoded Information:</p>
          <ul className="qr-details">
            <li>✓ Name: {patient.name}</li>
            <li>✓ Blood Group: <span className="blood-group">{patient.bloodGroup}</span></li>
            <li>✓ Age: {patient.age} years</li>
            <li>✓ Allergies: {patient.allergies.join(', ')}</li>
            <li>✓ Emergency Contact: {patient.emergencyContact}</li>
            <li>✓ Medical History & Medications</li>
          </ul>
          <p className="hint">🚨 Scan this QR code during emergencies to access critical health information</p>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [reportText, setReportText] = useState('');
  const [patient, setPatient] = useState({
    id: 'ADITI-2026',
    name: 'Aditi Shikha',
    age: 28,
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    emergencyContact: '+91-9876543210',
    medications: ['Aspirin 500mg', 'Vitamin D 1000IU'],
    medicalHistory: ['Mild Asthma', 'Seasonal Allergies'],
  });

  const handlePatientUpdate = (updatedPatient) => {
    setPatient(updatedPatient);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏥 MediPlain</h1>
        <p>Simple Medical Report Explanation</p>
      </header>

      <div className="container">
        <div className="left-column">
          <HealthSummary patient={patient} onUpdate={handlePatientUpdate} />
          <UploadReport onReportUpload={setReportText} />
        </div>

        <div className="right-column">
          <ExplainReport reportText={reportText} />
          <QRAccess patient={patient} />
        </div>
      </div>

      <footer className="footer">
        <p>MediPlain © 2026 - Making Medical Reports Simple</p>
      </footer>
    </div>
  );
}
