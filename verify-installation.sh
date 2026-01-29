#!/bin/bash
# MediPlain - Installation Verification Script
# This script checks if all components are properly installed

echo ""
echo "========================================="
echo "  MediPlain Installation Verification"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
total=0
passed=0

# Function to check file exists
check_file() {
    local file=$1
    local name=$2
    total=$((total + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $name"
        passed=$((passed + 1))
    else
        echo -e "${RED}❌${NC} $name (missing)"
    fi
}

# Function to check directory exists
check_dir() {
    local dir=$1
    local name=$2
    total=$((total + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅${NC} $name"
        passed=$((passed + 1))
    else
        echo -e "${RED}❌${NC} $name (missing)"
    fi
}

# Function to check command exists
check_command() {
    local cmd=$1
    local name=$2
    total=$((total + 1))
    
    if command -v "$cmd" &> /dev/null; then
        local version=$($cmd --version 2>&1 | head -n 1)
        echo -e "${GREEN}✅${NC} $name: $version"
        passed=$((passed + 1))
    else
        echo -e "${RED}❌${NC} $name (not installed)"
    fi
}

echo "🔍 Checking System Requirements..."
echo ""
check_command "node" "Node.js"
check_command "npm" "npm"
echo ""

echo "🔍 Checking Frontend Structure..."
echo ""
check_dir "src" "src directory"
check_dir "src/components" "components directory"
check_dir "src/pages" "pages directory"
check_dir "src/services" "services directory (NEW)"
check_dir "src/utils" "utils directory (NEW)"
check_dir "src/store" "store directory (NEW)"
check_dir "src/config" "config directory (NEW)"
echo ""

echo "🔍 Checking Key Service Files..."
echo ""
check_file "src/services/aiService.js" "AI Service"
check_file "src/services/firebaseService.js" "Firebase Service"
check_file "src/utils/encryption.js" "Encryption Utils"
check_file "src/utils/ocr.js" "OCR Utils"
check_file "src/utils/qrCode.js" "QR Code Utils"
check_file "src/store/index.js" "Zustand Store"
check_file "src/config/firebase.js" "Firebase Config"
echo ""

echo "🔍 Checking Backend..."
echo ""
check_dir "server" "server directory"
check_file "server/index.js" "Express Server"
check_file "server/package.json" "Backend package.json"
check_file "server/.env.example" "Backend .env template"
echo ""

echo "🔍 Checking Documentation..."
echo ""
check_file "GETTING_STARTED.md" "Getting Started Guide"
check_file "COMPLETE_SETUP.md" "Complete Setup Guide"
check_file "INTEGRATION_GUIDE.md" "Integration Guide"
check_file "IMPLEMENTATION_SUMMARY.md" "Implementation Summary"
check_file "ARCHITECTURE.md" "Architecture Documentation"
check_file "TROUBLESHOOTING.md" "Troubleshooting Guide"
check_file "FILE_MANIFEST.md" "File Manifest"
echo ""

echo "🔍 Checking Configuration..."
echo ""
check_file ".env.example" "Frontend .env template"
check_file "package.json" "Frontend package.json"
check_file "vite.config.js" "Vite config"
echo ""

echo "🔍 Checking Setup Scripts..."
echo ""
check_file "quick-start.bat" "Windows quick start"
check_file "quick-start.sh" "Mac/Linux quick start"
echo ""

echo "🔍 Checking Dependencies..."
echo ""

# Check frontend dependencies
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Frontend node_modules installed"
    passed=$((passed + 1))
    
    # Check key packages
    if [ -d "node_modules/react" ]; then
        echo -e "${GREEN}  ✓${NC} react"
    fi
    if [ -d "node_modules/firebase" ]; then
        echo -e "${GREEN}  ✓${NC} firebase"
    fi
    if [ -d "node_modules/crypto-js" ]; then
        echo -e "${GREEN}  ✓${NC} crypto-js"
    fi
    if [ -d "node_modules/zustand" ]; then
        echo -e "${GREEN}  ✓${NC} zustand"
    fi
    if [ -d "node_modules/qrcode" ]; then
        echo -e "${GREEN}  ✓${NC} qrcode"
    fi
else
    echo -e "${RED}❌${NC} Frontend dependencies not installed"
    echo "   Run: npm install"
fi
total=$((total + 1))
echo ""

# Check backend dependencies
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✅${NC} Backend node_modules installed"
    passed=$((passed + 1))
    
    if [ -d "server/node_modules/express" ]; then
        echo -e "${GREEN}  ✓${NC} express"
    fi
    if [ -d "server/node_modules/cors" ]; then
        echo -e "${GREEN}  ✓${NC} cors"
    fi
else
    echo -e "${RED}❌${NC} Backend dependencies not installed"
    echo "   Run: cd server && npm install"
fi
total=$((total + 1))
echo ""

echo "========================================="
echo ""

# Summary
percentage=$((passed * 100 / total))
echo "✅ Installation Check: $passed/$total components verified"
echo "   Success Rate: $percentage%"
echo ""

if [ $passed -eq $total ]; then
    echo -e "${GREEN}🎉 All checks passed! You're ready to go!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create .env file (copy from .env.example)"
    echo "2. Add Firebase credentials to .env"
    echo "3. Start backend: cd server && node index.js"
    echo "4. Start frontend: npm run dev"
    echo "5. Open http://localhost:5173 in browser"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Some components are missing${NC}"
    echo ""
    echo "Missing items:"
    if [ ! -d "node_modules" ]; then
        echo "• Frontend dependencies - Run: npm install"
    fi
    if [ ! -d "server/node_modules" ]; then
        echo "• Backend dependencies - Run: cd server && npm install"
    fi
    echo ""
    echo "See documentation for more help:"
    echo "• GETTING_STARTED.md"
    echo "• TROUBLESHOOTING.md"
    echo ""
    exit 1
fi
