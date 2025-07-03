#!/bin/bash

echo "🚀 Starting Multi-Tenant Admin Module Development Environment"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MySQL is running (optional check)
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL client not found. Make sure MySQL is installed and running."
fi

echo "📋 Prerequisites check completed."

# Start Backend
echo "🔧 Starting Backend..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Backend .env file not found. Please copy env.example to .env and configure it."
    echo "   cp env.example .env"
    echo "   Then update the DATABASE_URL and JWT_SECRET in .env"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Start backend in background
echo "🚀 Starting backend server on http://localhost:3000"
npm run start:dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend..."
cd ../frontend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Frontend .env file not found. Please copy env.example to .env and configure it."
    echo "   cp env.example .env"
    echo "   Then update the VITE_BACKEND_URL in .env"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🚀 Starting frontend server on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "📊 API:      http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 