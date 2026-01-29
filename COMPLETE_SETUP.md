# 🏥 MediPlain - Complete Tech Stack Implementation

A comprehensive medical report management system with AI-powered insights, OCR document parsing, encrypted cloud storage, and emergency QR access.

## ✨ Tech Stack

### Frontend
- **React 19.2** - Modern UI framework
- **React Router DOM 7.13** - Client-side routing
- **Vite 7.2** - Fast build tool and dev server
- **Zustand 4.5** - State management
- **React Hot Toast 2.4** - Notifications

### Backend & Cloud
- **Node.js/Express** - REST API server
- **Firebase** - Authentication, Firestore (database), Cloud Storage
  - Firestore for patient data storage
  - Cloud Storage for medical report files
  - Firebase Auth for user authentication

### AI & NLP
- **Medical-tuned LLM** - Specialized language model for medical report analysis
- **OpenAI API** (optional) - For AI explanations
- **Anthropic Claude** (optional) - Alternative LLM provider

### Document Processing
- **Tesseract.js 7.0** - OCR (Optical Character Recognition)
- **Layout-aware document parsing** - Intelligent medical document structure recognition

### Security
- **crypto-js 4.2** - AES-256 encryption for sensitive data
- **jose 5.4** - JWT tokens and encryption
- **Time-bound QR codes** - Automatic expiration for emergency access

### Additional Libraries
- **axios 1.7** - HTTP client for API calls
- **qrcode 1.5 & qrcode.react 1.0** - QR code generation and React components
- **react-calendar 6.0** - Date picker component
- **ESLint** - Code quality and linting

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase account (for Firestore, Storage, Auth)
- (Optional) OpenAI API key for advanced AI features

## 🚀 Quick Start

### 1. Frontend Setup

```bash
cd MediPlain
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENCRYPTION_KEY=your_encryption_key
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
LLM_API_KEY=your_llm_api_key
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

## 🎯 Core Features

### 1. Medical Report Upload & OCR
- Upload medical reports as images (JPG, PNG, PDF)
- Automatic OCR extraction using Tesseract.js
- Layout-aware document parsing
- Structured data extraction

```javascript
import { processReportImage } from './utils/ocr';

const result = await processReportImage(file);
// Returns: { text, confidence, parsed, fileName, uploadedAt }
```

### 2. AI-Powered Health Insights
- Medical-tuned LLM analysis
- Personalized health recommendations
- Anomaly detection
- Emergency summary generation

```javascript
import { explainMedicalReport, generateHealthRecommendations } from './services/aiService';

const explanation = await explainMedicalReport({ text: reportText });
// Returns: { explanation, summary, keyFindings, recommendations, warnings }

const recs = await generateHealthRecommendations(healthData, reportData);
// Returns: { lifestyle, diet, exercise, medications, followUp }
```

### 3. Emergency QR Access
- Time-bound QR codes with encryption
- Configurable expiration (15 min - 24 hours)
- No login required for emergency responders
- AES-256 encryption with jose

```javascript
import { generateEmergencyQR } from './utils/qrCode';

const qrData = await generateEmergencyQR(patientData, expirationMinutes);
// Returns: { token, qrCode, expiresAt, createdAt }
```

### 4. Encrypted Cloud Storage
- Sensitive data encrypted with AES-256
- Firebase Cloud Storage for report files
- Secure Firestore database
- Time-bound access tokens

```javascript
import { encryptData, decryptData, createTimeBoundToken } from './utils/encryption';

const encrypted = encryptData(sensitiveData);
const token = createTimeBoundToken({ userId: '123' }, 30); // 30 min expiration
const decrypted = decryptData(encrypted);
```

### 5. Patient Health Dashboard
- Real-time health data management
- Medical history tracking
- Medication reminders
- Doctor consultation scheduling

### 6. State Management with Zustand
- Centralized health data store
- UI state management
- Efficient re-renders

```javascript
import { useHealthStore, useUIStore } from './store';

const { patient, reports, reminders, setPatient } = useHealthStore();
const { activeTab, showModal, toggleSidebar } = useUIStore();
```

## 📁 Project Structure

```
MediPlain/
├── src/
│   ├── components/
│   │   ├── ExplainReport.jsx      # AI insights component
│   │   ├── UploadReport.jsx       # OCR upload component
│   │   ├── QRAccess.jsx           # Emergency QR generation
│   │   ├── HealthSummary.jsx      # Health dashboard
│   │   ├── Navbar.jsx             # Navigation
│   │   └── Modal.jsx              # Modal component
│   ├── pages/
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   └── EmergencyView.jsx      # Emergency access view
│   ├── services/
│   │   ├── aiService.js           # AI/LLM integration
│   │   └── firebaseService.js     # Firebase operations
│   ├── utils/
│   │   ├── encryption.js          # Encryption utilities
│   │   ├── ocr.js                 # OCR processing
│   │   └── qrCode.js              # QR code generation
│   ├── store/
│   │   └── index.js               # Zustand store
│   ├── config/
│   │   └── firebase.js            # Firebase config
│   └── App.jsx
├── server/
│   ├── index.js                   # Express API server
│   └── package.json
├── package.json
├── vite.config.js
└── .env.example
```

## 🔒 Security Features

### Encryption
- AES-256 for data at rest
- TLS/SSL for data in transit
- Environment variable-based secret management

### Authentication
- Firebase Auth integration
- JWT tokens via jose
- Time-bound access tokens

### Data Privacy
- Patient data encrypted in Firestore
- Encrypted cloud storage for reports
- HIPAA-compliant design ready

## 🧪 Testing the Features

### 1. Upload a Medical Report
1. Go to the Dashboard
2. Click "Upload Report"
3. Upload a medical document image
4. OCR will extract text automatically

### 2. Generate AI Insights
1. After uploading a report
2. Click "AI Analyze Report"
3. Get AI-powered health insights and recommendations

### 3. Create Emergency QR
1. Go to "Emergency QR Access" section
2. Select QR expiration time
3. Click "Generate QR Code"
4. Download, print, or share the QR code

### 4. Access Emergency Data
1. Scan the generated QR code
2. You'll be redirected to encrypted health summary
3. Data automatically expires after set time

## 📱 API Endpoints

### AI & LLM
- `POST /api/ai/explain-report` - Analyze medical report
- `POST /api/ai/generate-recommendations` - Get health recommendations
- `POST /api/ai/analyze-anomaly` - Detect health anomalies
- `POST /api/ai/emergency-summary` - Generate emergency info
- `POST /api/ai/chat` - Chat with medical assistant

### Health Check
- `GET /api/health` - Server status

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_API_BASE_URL
VITE_ENCRYPTION_KEY
VITE_LLM_API_KEY
VITE_LLM_MODEL
```

**Backend (.env)**
```
PORT
NODE_ENV
CORS_ORIGIN
LLM_API_KEY
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
OPENAI_API_KEY
ANTHROPIC_API_KEY
ENCRYPTION_KEY
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/Render)
```bash
cd server
npm start
```

### Firebase Setup
1. Create Firebase project
2. Enable Firestore Database
3. Enable Cloud Storage
4. Set up Firebase Auth
5. Download service account key for backend

## 📚 Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [Zustand](https://github.com/pmndrs/zustand)

## 🛠️ Troubleshooting

### OCR Not Working
- Ensure image quality is good
- Try with different image formats
- Check browser console for errors

### Firebase Connection Issues
- Verify API keys in .env
- Check Firebase project settings
- Ensure Firestore is enabled

### AI Service Not Responding
- Start backend server: `npm run dev` in server folder
- Check backend .env configuration
- Verify LLM API credentials

### QR Code Encryption Issues
- Verify encryption key in .env
- Ensure jose package is installed
- Check browser console for crypto errors

## 📧 Support

For issues and questions:
1. Check the documentation
2. Review error messages in console
3. Check Firebase console for data
4. Verify all environment variables

## 📄 License

MIT License - Free to use for educational and commercial purposes

## 🎓 Educational Value

This project demonstrates:
- Modern React patterns with hooks
- Firebase integration
- OCR technology
- Encryption best practices
- State management with Zustand
- Express.js REST APIs
- Medical data handling
- QR code generation and encryption
- Responsive UI design

---

**Built with ❤️ for better healthcare access**

Current Date: January 29, 2026
