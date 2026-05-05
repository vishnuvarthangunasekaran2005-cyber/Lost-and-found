@echo off
echo ========================================
echo    FindIt Lost and Found Application
echo ========================================
echo.

echo [1/4] Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found! Please install Java 17 or higher.
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)
echo ✅ Java found

echo.
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js 18 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo [3/4] Starting Backend (Spring Boot)...
cd backend
echo Building and starting backend server...
start "FindIt Backend" cmd /k "mvnw.cmd clean spring-boot:run"
cd ..

echo.
echo [4/4] Starting Frontend (React + Vite)...
cd frontend
echo Installing dependencies and starting frontend...
start "FindIt Frontend" cmd /k "npm install && npm run dev"
cd ..

echo.
echo ========================================
echo ✅ FindIt Application is starting up!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:8080/api
echo.
echo 👤 Demo Accounts:
echo    Admin: admin@findit.com / Admin@123
echo    User:  alice@example.com / User@123
echo.
echo ⚠️  Make sure MongoDB is running on localhost:27017
echo    Or use Docker: docker run -d -p 27017:27017 mongo:6
echo.
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:5173