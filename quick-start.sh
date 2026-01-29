#!/bin/bash

# MediPlain Quick Start Script for Mac/Linux

echo ""
echo "========================================"
echo "   MediPlain - Medical Health Platform"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detected:"
node --version

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd MediPlain
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi

echo "✅ Backend dependencies installed"
cd ..

echo ""
echo "========================================"
echo "    Setup Complete!"
echo "========================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create .env files:"
echo "   - MediPlain/.env (frontend)"
echo "   - MediPlain/server/.env (backend)"
echo ""
echo "   Copy from .env.example files and add your credentials"
echo ""
echo "2. Start the backend:"
echo "   cd MediPlain/server"
echo "   npm run dev"
echo ""
echo "3. In another terminal, start frontend:"
echo "   cd MediPlain"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For detailed instructions, see INTEGRATION_GUIDE.md"
echo ""
