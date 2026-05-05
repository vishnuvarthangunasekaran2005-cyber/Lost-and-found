@echo off
echo Starting FindIt Lost and Found Application...
echo.

echo [1/3] Starting MongoDB...
echo Make sure MongoDB is running on localhost:27017
echo.

echo [2/3] Starting Backend (Spring Boot)...
cd backend
start "Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo [3/3] Starting Frontend (React + Vite)...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Application is starting up!
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:8080
echo 📊 API Docs: http://localhost:8080/api
echo.
echo Demo Accounts:
echo 👑 Admin: admin@findit.com / Admin@123
echo 👤 User:  alice@example.com / User@123
echo.
pause