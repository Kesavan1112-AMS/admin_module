@echo off
echo 🚀 Starting Multi-Tenant Admin Module Development Environment
echo ==========================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo 📋 Prerequisites check completed.

REM Start Backend
echo 🔧 Starting Backend...
cd backend

REM Check if .env exists
if not exist .env (
    echo ⚠️  Backend .env file not found. Please copy env.example to .env and configure it.
    echo    copy env.example .env
    echo    Then update the DATABASE_URL and JWT_SECRET in .env
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing backend dependencies...
    npm install
)

REM Generate Prisma client
echo 🗄️  Generating Prisma client...
npx prisma generate

REM Start backend in background
echo 🚀 Starting backend server on http://localhost:3000
start "Backend Server" cmd /k "npm run start:dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo 🎨 Starting Frontend...
cd ..\frontend

REM Check if .env exists
if not exist .env (
    echo ⚠️  Frontend .env file not found. Please copy env.example to .env and configure it.
    echo    copy env.example .env
    echo    Then update the VITE_BACKEND_URL in .env
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start frontend
echo 🚀 Starting frontend server on http://localhost:5173
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Development environment started!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000
echo 📊 API:      http://localhost:3000/api
echo.
echo Close the command windows to stop the servers.
pause 