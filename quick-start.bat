@echo off
REM MediPlain Quick Start Script

echo.
echo ========================================
echo    MediPlain - Medical Health Platform
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

echo.
echo 📦 Installing dependencies...
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd MediPlain
call npm install

if errorlevel 1 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd server
call npm install

if errorlevel 1 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed
cd ..

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo 📝 Next Steps:
echo.
echo 1. Create .env files:
echo    - MediPlain/.env (frontend)
echo    - MediPlain/server/.env (backend)
echo.
echo    Copy from .env.example files and add your credentials
echo.
echo 2. Start the backend:
echo    cd MediPlain/server
echo    npm run dev
echo.
echo 3. In another terminal, start frontend:
echo    cd MediPlain
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo 📚 For detailed instructions, see INTEGRATION_GUIDE.md
echo.
pause
