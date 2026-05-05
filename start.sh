#!/bin/bash

echo "Starting FindIt Lost and Found Application..."
echo

echo "[1/3] Starting MongoDB..."
echo "Make sure MongoDB is running on localhost:27017"
echo

echo "[2/3] Starting Backend (Spring Boot)..."
cd backend
gnome-terminal --title="Backend" -- bash -c "./mvnw spring-boot:run; exec bash" &
cd ..

echo "[3/3] Starting Frontend (React + Vite)..."
cd frontend
gnome-terminal --title="Frontend" -- bash -c "npm run dev; exec bash" &
cd ..

echo
echo "✅ Application is starting up!"
echo
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8080"
echo "📊 API Docs: http://localhost:8080/api"
echo
echo "Demo Accounts:"
echo "👑 Admin: admin@findit.com / Admin@123"
echo "👤 User:  alice@example.com / User@123"
echo