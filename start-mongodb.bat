@echo off
echo Starting MongoDB using Docker...
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found! 
    echo Please install Docker Desktop or start MongoDB manually.
    pause
    exit /b 1
)

echo ✅ Docker found
echo.
echo Starting MongoDB container...
docker run -d --name findit-mongodb -p 27017:27017 mongo:6

if %errorlevel% equ 0 (
    echo ✅ MongoDB started successfully on port 27017
) else (
    echo ℹ️  MongoDB container might already be running
    echo Trying to start existing container...
    docker start findit-mongodb
)

echo.
echo MongoDB is ready! You can now run the application.
echo Use 'run.bat' to start the full application.
pause