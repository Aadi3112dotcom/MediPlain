# 🔧 MediPlain - Troubleshooting Guide

## Common Issues & Solutions

### Installation Issues

#### Issue: "npm: command not found"
**Cause:** Node.js not installed
**Solution:**
```bash
# Download and install Node.js from https://nodejs.org
# Requires Node 16+ and npm 7+

# Verify installation
node --version
npm --version
```

#### Issue: "Cannot find module 'express'"
**Cause:** Backend dependencies not installed
**Solution:**
```bash
cd MediPlain/server
npm install
```

#### Issue: "Cannot find module 'react'"
**Cause:** Frontend dependencies not installed
**Solution:**
```bash
cd MediPlain
npm install
```

#### Issue: "EACCES: permission denied"
**Cause:** Permission issues on Mac/Linux
**Solution:**
```bash
# Use sudo carefully
sudo chown -R $(whoami) ~/.npm

# Or use nvm (Node Version Manager)
# https://github.com/nvm-sh/nvm
```

---

### Configuration Issues

#### Issue: "Cannot find module 'firebase'"
**Cause:** Firebase package not in dependencies
**Solution:**
```bash
cd MediPlain
npm install firebase
```

#### Issue: "VITE_FIREBASE_API_KEY is undefined"
**Cause:** .env file not created or not loaded
**Solution:**
1. Create `.env` file in `MediPlain/` folder
2. Copy content from `.env.example`
3. Add your Firebase credentials
4. Restart dev server (stop and `npm run dev`)

#### Issue: "CORS error when calling API"
**Cause:** Backend CORS not configured properly
**Solution:**
1. Check `server/.env` has correct `CORS_ORIGIN`
2. Should be `http://localhost:5173` for development
3. Restart backend server
4. Check that backend is running on port 3000

#### Issue: "Failed to parse .env file"
**Cause:** Invalid syntax in .env
**Solution:**
```env
# Correct format (no quotes needed):
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENCRYPTION_KEY=my-secret-key-12345

# Wrong (don't do this):
VITE_API_BASE_URL = "http://localhost:3000/api"  # Extra spaces and quotes
```

---

### Runtime Issues

#### Issue: "OCR is taking too long"
**Cause:** Tesseract model downloading (65MB first time)
**Solution:**
- First OCR run downloads and caches model
- Takes 30-60 seconds on first use
- Subsequent runs use cache (much faster)
- Ensure good internet connection during first use

#### Issue: "QR code not displaying"
**Cause:** Missing qrcode package or generation failed
**Solution:**
```bash
# Reinstall qrcode packages
cd MediPlain
npm install qrcode qrcode.react
npm run dev
```

#### Issue: "Encryption/decryption errors"
**Cause:** crypto-js not working or key mismatch
**Solution:**
```bash
# Reinstall crypto-js
cd MediPlain
npm install crypto-js

# Check browser console (F12) for specific errors
# Verify VITE_ENCRYPTION_KEY is set in .env
```

#### Issue: "Firebase connection timeout"
**Cause:** Firebase not initialized or credentials wrong
**Solution:**
1. Check `.env` file has all Firebase credentials
2. Verify credentials match your Firebase project
3. Check Firebase project is accessible online
4. Try: Open Firebase Console → Project Settings → Copy credentials again

#### Issue: "API calls returning 500 error"
**Cause:** Backend server error or incorrect endpoint
**Solution:**
```bash
# 1. Check backend is running
# In server terminal, you should see:
# 🏥 MediPlain API Server running on http://localhost:3000

# 2. Check API endpoint in browser DevTools
# F12 → Network tab → Look for API calls

# 3. Check backend console for errors

# 4. Verify VITE_API_BASE_URL is correct
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Issue: "React Hook 'useState' called conditionally"
**Cause:** Hook called inside condition or loop
**Solution:**
```javascript
// ❌ WRONG - Hook inside condition
if (condition) {
  const [state, setState] = useState();
}

// ✅ CORRECT - Hook at top level
const [state, setState] = useState();
if (condition) {
  // Use state here
}
```

---

### Performance Issues

#### Issue: "App is slow/freezing"
**Cause:** Large OCR files or excessive re-renders
**Solution:**
```bash
# 1. Reduce image size before uploading
# 2. Close unused browser tabs
# 3. Check browser DevTools Performance tab
# 4. Restart development server
npm run dev
```

#### Issue: "Memory usage increasing"
**Cause:** Memory leaks or large file uploads
**Solution:**
```javascript
// Add cleanup in useEffect
useEffect(() => {
  return () => {
    // Cleanup code here
  };
}, []);
```

#### Issue: "Network requests timing out"
**Cause:** Slow API or large payloads
**Solution:**
```javascript
// Increase timeout
const client = axios.create({
  timeout: 60000 // 60 seconds instead of default 30s
});
```

---

### Firebase Issues

#### Issue: "Firestore permission denied"
**Cause:** Security rules not configured for development
**Solution:**
1. Open Firebase Console → Firestore Database
2. Go to "Rules" tab
3. Use test mode rules for development:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // FOR DEVELOPMENT ONLY
    }
  }
}
```

#### Issue: "Cloud Storage upload fails"
**Cause:** Storage rules or permissions
**Solution:**
1. Check Firebase Console → Storage → Rules
2. Use permissive rules for testing:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;  // FOR DEVELOPMENT ONLY
    }
  }
}
```

#### Issue: "Firebase Auth not working"
**Cause:** Auth not enabled or configured
**Solution:**
1. Go to Firebase Console → Authentication
2. Click "Get Started"
3. Enable desired providers (Email/Password, Google, etc.)
4. Update code to use auth

---

### Terminal/Build Issues

#### Issue: "Port 3000 already in use"
**Cause:** Another app using the port
**Solution:**
```bash
# Option 1: Use different port
# Change in server/.env
PORT=3001

# Option 2: Kill process using port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

#### Issue: "Port 5173 already in use"
**Cause:** Vite dev server still running
**Solution:**
```bash
# Use different port
npm run dev -- --port 5174

# Or kill the process:
# Windows: netstat -ano | findstr :5173, then taskkill /PID <PID> /F
# Mac/Linux: lsof -i :5173, then kill -9 <PID>
```

#### Issue: "npm run dev shows ESLint errors"
**Cause:** Code formatting issues
**Solution:**
```bash
# Fix ESLint issues automatically
npm run lint -- --fix

# Or disable for development (not recommended)
# Edit vite.config.js and comment out ESLint plugin
```

#### Issue: ".git directory issues"
**Cause:** Git initialization conflicts
**Solution:**
```bash
# Remove nested git folders if duplicate
rm -rf MediPlain/.git

# Keep only one .git at root:
# MEDI-PLAIN/.git (main repo)
```

---

### Browser Issues

#### Issue: "Blank white page"
**Cause:** React not rendering or build error
**Solution:**
```bash
# 1. Check browser console (F12 → Console)
# 2. Check for red error messages
# 3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# 4. Clear browser cache
# 5. Check if npm run dev is still running
```

#### Issue: "Hot reload not working"
**Cause:** Vite HMR misconfigured
**Solution:**
```bash
# Restart dev server
npm run dev

# Or clear cache
rm -rf node_modules/.vite
npm run dev
```

#### Issue: "Console shows CORS errors"
**Cause:** Frontend and backend not matching
**Solution:**
```env
# Frontend .env
VITE_API_BASE_URL=http://localhost:3000/api

# Backend .env
CORS_ORIGIN=http://localhost:5173
PORT=3000
```

---

### Feature-Specific Issues

#### OCR Issues
```javascript
// Check Tesseract.js version
npm list tesseract.js

// Check image format
// Supports: JPG, PNG, JPEG, WEBP, etc.

// Check browser console for OCR progress
// Should see: "OCR Progress: { progress: 0.5, ... }"
```

#### AI/LLM Issues
```javascript
// Check backend is running
// Terminal should show: "🏥 MediPlain API Server running on http://localhost:3000"

// Check API endpoint
curl http://localhost:3000/api/health

// Check VITE_API_BASE_URL is correct in .env
```

#### QR Code Issues
```javascript
// Check health data is loaded
// Debug: console.log(healthData) in component

// Check qrcode packages installed
npm list qrcode qrcode.react

// Check encryption key is set
// Should not be empty in .env
```

#### Encryption Issues
```javascript
// Check crypto-js installed
npm list crypto-js

// Verify encryption key
console.log(import.meta.env.VITE_ENCRYPTION_KEY)

// Test encryption locally
// Open browser console and test:
import { encryptData } from './utils/encryption'
encryptData({ test: 'data' })
```

---

### Data Issues

#### Issue: "Patient data not saving"
**Cause:** Firebase not initialized or user not logged in
**Solution:**
```bash
# 1. Check Firebase .env variables are correct
# 2. Check Firebase console shows data
# 3. Check browser console for Firebase errors
# 4. Try manually in browser console:
import { db } from './config/firebase'
console.log(db)
```

#### Issue: "Reports not uploading"
**Cause:** Storage permissions or file size
**Solution:**
```bash
# 1. Check file size (limit ~10MB for uploads)
# 2. Check Storage rules in Firebase
# 3. Try with smaller file first
# 4. Check browser console for upload errors
```

---

### Debugging Tips

#### Enable Debug Logging
```javascript
// Add to src/main.jsx
window.DEBUG = true;

// Then check console for detailed logs
console.log('Debug info:', data);
```

#### Browser DevTools
```
F12 or Right-click → Inspect

Useful tabs:
- Console: Error messages and logs
- Network: API calls and responses
- Application: Local storage, cookies, session
- Sources: Set breakpoints and debug
```

#### Check Environment Variables
```javascript
// In browser console:
console.log(import.meta.env)  // Frontend only
```

#### Check API Responses
```javascript
// F12 → Network tab
// Click API request
// Go to Response tab to see response data
```

---

### When All Else Fails

1. **Clear everything and start fresh:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Delete dist folder
rm -rf dist

# Clear browser cache
# Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
```

2. **Check GitHub Issues:**
   - Search package GitHub repos for similar issues
   - Check Tesseract.js, Firebase, React issues

3. **Read Official Documentation:**
   - [React Docs](https://react.dev)
   - [Firebase Docs](https://firebase.google.com/docs)
   - [Vite Guide](https://vitejs.dev/guide/)

4. **Create Minimal Reproduction:**
   - Isolate the problem in a small test file
   - Remove unrelated code
   - Test individual features

5. **Use Stack Overflow:**
   - Search your error message
   - Ask with detailed error logs
   - Include versions and code snippet

---

## 📞 Getting Help

### Before asking for help, provide:
1. Error message (full text from console)
2. Steps to reproduce
3. What you expected
4. Package versions (`npm list <package>`)
5. Operating system (Windows/Mac/Linux)
6. Code snippet if relevant

### Resources:
- [Stack Overflow - React](https://stackoverflow.com/questions/tagged/reactjs)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)
- [GitHub Issues](https://github.com)
- [Discord Communities](https://discord.com)

---

## ✅ Verification Checklist

If something isn't working, check:

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm up to date (`npm --version`)
- [ ] All dependencies installed (`npm list`)
- [ ] .env files created and filled
- [ ] Backend running on port 3000 (`npm run dev` in server/)
- [ ] Frontend running on port 5173 (`npm run dev` in MediPlain/)
- [ ] No red errors in browser console (F12)
- [ ] No errors in backend terminal
- [ ] Firebase project created and credentials in .env
- [ ] CORS configured correctly
- [ ] Encryption key is not empty

---

**Still stuck? Check the logs carefully - they usually tell you exactly what's wrong!** 🔍
