# FindIt Setup Guide

## Quick Start (Recommended)

### Option 1: Using Startup Scripts
1. **Windows**: Double-click `start.bat`
2. **Linux/Mac**: Run `chmod +x start.sh && ./start.sh`

### Option 2: Using Docker Compose
```bash
docker-compose up -d
```

## Manual Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MongoDB 6+

### 1. Database Setup
```bash
# Start MongoDB
mongod --dbpath /your/data/path

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

### 2. Backend Setup
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **MongoDB**: localhost:27017

## Demo Accounts
- **Admin**: admin@findit.com / Admin@123
- **Staff**: staff@findit.com / Staff@123  
- **User**: alice@example.com / User@123

## Environment Configuration
Copy `.env.example` to `.env` and modify as needed:
```bash
cp .env.example .env
```

## Production Deployment
1. Update environment variables in `.env`
2. Build frontend: `cd frontend && npm run build`
3. Package backend: `cd backend && mvn clean package`
4. Deploy using Docker Compose or your preferred method

## Troubleshooting
- Ensure MongoDB is running before starting the backend
- Check that ports 5173, 8080, and 27017 are available
- Verify Java 17+ and Node.js 18+ are installed
- Clear browser cache if experiencing frontend issues