# 🔧 MediPlain - Integration & Testing Guide

## Step-by-Step Integration

### Phase 1: Environment Setup ✅

#### Frontend Environment Variables
Create `.env` in `MediPlain/` folder:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDemoKey12345678901234567890
VITE_FIREBASE_AUTH_DOMAIN=mediaplain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mediaplain-demo
VITE_FIREBASE_STORAGE_BUCKET=mediaplain-demo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Encryption
VITE_ENCRYPTION_KEY=mediaplain-secret-key-2026

# LLM Configuration
VITE_LLM_API_KEY=your_llm_api_key
VITE_LLM_MODEL=medical-tuned-llm-v1

# Environment
VITE_ENV=development
```

#### Backend Environment Variables
Create `.env` in `MediPlain/server/` folder:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# LLM API Configuration
LLM_API_KEY=your_llm_api_key_here
LLM_API_URL=https://api.example.com/v1

# Firebase Admin (optional for server)
FIREBASE_PROJECT_ID=mediaplain-demo
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email@appspot.gserviceaccount.com

# Encryption
ENCRYPTION_KEY=your_server_encryption_key

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Phase 2: Firebase Setup (Optional but Recommended)

To fully enable cloud features:

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add project"
   - Name it "MediPlain"
   - Enable Google Analytics

2. **Enable Firestore Database**
   - In Firebase Console: Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
   - Choose region close to you

3. **Enable Cloud Storage**
   - In Firebase Console: Storage
   - Click "Get Started"
   - Choose bucket location
   - Keep default security rules for testing

4. **Get Firebase Config**
   - In Firebase Console: Project Settings
   - Copy your config object
   - Paste values into `.env` file

### Phase 3: Run the Application

#### Terminal 1: Start Backend
```bash
cd MediPlain/server
npm run dev
```
Expected output:
```
🏥 MediPlain API Server running on http://localhost:3000
Environment: development
```

#### Terminal 2: Start Frontend
```bash
cd MediPlain
npm run dev
```
Expected output:
```
  VITE v7.2.4  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Visit `http://localhost:5173` in your browser!

---

## ✨ Feature Testing Guide

### 1. Medical Report Upload & OCR

**Steps:**
1. Click "📤 Upload Medical Report"
2. Drag and drop or select a medical document image
3. Wait for OCR processing
4. See extracted text below

**Expected Results:**
- Progress bar shows extraction progress
- Success message appears
- Extracted text displays in the box
- Can copy or download extracted text

**Test Files:**
- Use clear, high-quality medical document images
- Try with different image formats (JPG, PNG)
- Test with small and large files

---

### 2. AI Health Insights Analysis

**Steps:**
1. Upload a medical report (see above)
2. Click "🔍 AI Analyze Report" button
3. Wait for AI analysis (may take 10-30 seconds)
4. View insights and recommendations

**Expected Results:**
- AI generates health insights
- Shows status for each parameter (good/warning/info)
- Lists personalized recommendations
- Empathetic messaging displayed

**Behind the Scenes:**
- Frontend calls `/api/ai/explain-report`
- Backend processes with medical-tuned LLM
- Returns structured analysis
- UI displays formatted recommendations

---

### 3. Emergency QR Code Generation

**Steps:**
1. Scroll to "Emergency QR Access" section
2. Select QR expiration time (15 min to 24 hours)
3. Click "🔄 Generate QR Code"
4. See QR code appear with critical info

**Expected Results:**
- QR code displays
- Shows critical health info
- Expiration time shown
- Can download, print, or share

**Security Features Active:**
- Data encrypted with AES-256
- Token time-bound (auto-expires)
- No login required for emergency responders
- Encrypted transmission

**Test Emergency Access:**
1. Click "📤 Share Access" to get emergency link
2. Open link in new tab (simulates responder scanning)
3. Should see encrypted health summary
4. Wait for token to expire (test with short expiration)

---

### 4. Patient Health Data Management

**Steps:**
1. Check "Health Summary" card on right
2. See patient information: name, blood group, age, allergies
3. View chronic conditions and medications
4. See last medical visit date

**Editable Fields:**
- Click on any health data field to edit
- Data auto-saves to store
- Updates sync across components

---

### 5. Security & Encryption

**Automatic Protection:**
- All sensitive data encrypted with AES-256
- Patient data stored encrypted in Firestore
- QR codes contain encrypted tokens
- Time-bound access automatically expires

**Test Encryption:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try this code:
```javascript
import { encryptData, decryptData } from './utils/encryption';
const encrypted = encryptData({ patientId: 123 });
console.log('Encrypted:', encrypted);
const decrypted = decryptData(encrypted);
console.log('Decrypted:', decrypted);
```

---

## 🐛 Debugging & Troubleshooting

### Frontend Issues

**Issue: "Cannot find module 'firebase'"**
```bash
npm install firebase
```

**Issue: OCR takes too long**
- First OCR load is slowest (downloads Tesseract model ~65MB)
- Subsequent uses are cached
- Can take 30-60 seconds on first use

**Issue: QR code not appearing**
- Check browser console for errors
- Verify health data is loaded
- Make sure `qrcode` package is installed

**Issue: Encryption errors**
- Verify `VITE_ENCRYPTION_KEY` is set in .env
- Check crypto-js package installed
- Look for console errors

### Backend Issues

**Issue: "Cannot find module 'express'"**
```bash
cd server
npm install
```

**Issue: Port 3000 already in use**
```bash
# Change PORT in server/.env
PORT=3001
```

**Issue: CORS errors**
- Check `CORS_ORIGIN` in server/.env
- Verify frontend URL matches
- Restart backend after changes

**Issue: LLM API not responding**
- API endpoints return default responses
- Not required for basic functionality
- Can integrate with real LLM later

### Firebase Issues

**Issue: "Cannot read properties of undefined (reading 'auth')****
- Firebase not initialized
- Check firebase.js config
- Verify credentials in .env

**Issue: Firestore permission denied**
- In development, use test mode
- Later, set up proper security rules
- Check Firebase console for errors

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│  Components: Upload, Explain, QR, Health Summary        │
│  Store: Zustand (Health & UI State)                    │
│  Utils: OCR, Encryption, QR Generation                 │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────────────────┐
│               BACKEND (Node.js/Express)                 │
│  Routes: /api/ai/*, /api/health                        │
│  Services: AI/LLM Integration                          │
│  Database: Firebase Firestore                          │
│  Storage: Firebase Cloud Storage                       │
└─────────────────────────────────────────────────────────┘
                   │
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
   Firebase     Medical-tuned  Encryption
   Cloud        LLM Service     Services
```

---

## 🚀 Performance Optimization

### Frontend
- Lazy load components
- Memoize expensive calculations
- Cache OCR models
- Debounce form inputs

### Backend
- Add caching layer
- Implement rate limiting
- Use connection pooling
- Monitor LLM API calls

### Database
- Index frequently queried fields
- Archive old reports
- Use pagination for lists
- Optimize Firestore queries

---

## 📱 Mobile Testing

### iOS/Android
1. Get local IP: `ipconfig getifaddr en0`
2. Change `localhost` to IP in .env
3. Open on mobile: `http://YOUR_IP:5173`

### Responsive Design
- Test on mobile viewport (DevTools)
- Check tablet view
- Test landscape/portrait

---

## 🔐 Security Checklist

Before production:
- [ ] Change all encryption keys
- [ ] Enable Firebase authentication
- [ ] Set up proper Firestore rules
- [ ] Enable HTTPS
- [ ] Remove demo credentials
- [ ] Set up rate limiting
- [ ] Enable error tracking
- [ ] Configure backups
- [ ] Set up monitoring/logging

---

## 📈 Next Steps & Enhancements

### Phase 2 Features
- [ ] User authentication system
- [ ] Multi-patient management
- [ ] Doctor collaboration
- [ ] Appointment scheduling
- [ ] Prescription management
- [ ] Medication reminders with notifications

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with EHR systems
- [ ] Telemedicine capabilities
- [ ] ML-based health predictions
- [ ] Insurance claim automation

### Integrations
- [ ] OpenAI GPT-4 for advanced AI
- [ ] Anthropic Claude for medical analysis
- [ ] PagerDuty for emergency alerts
- [ ] Slack notifications
- [ ] Email notifications

---

## 📚 Additional Resources

### Documentation
- [React Hooks Guide](https://react.dev/reference/react)
- [Firebase Docs](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Zustand Pattern](https://github.com/pmndrs/zustand)

### Medical Data
- [DICOM Standard](https://www.dicomlibrary.com/)
- [HL7 Standards](https://www.hl7.org/)
- [HIPAA Compliance](https://www.hhs.gov/hipaa/)

### OCR & AI
- [Tesseract Docs](https://github.com/naptha/tesseract.js)
- [Medical NLP](https://github.com/topics/medical-nlp)

---

## 🆘 Getting Help

1. **Check Console**: Browser DevTools (F12) → Console tab
2. **Check Backend Logs**: Terminal running npm run dev
3. **Firebase Console**: Check for errors
4. **Network Tab**: See API requests
5. **Stack Overflow**: Search error message
6. **GitHub Issues**: Check similar projects

---

**Happy coding! 🎉**

For questions about specific features, check the COMPLETE_SETUP.md file.
