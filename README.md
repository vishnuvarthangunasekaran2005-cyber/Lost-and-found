# FindIt — Lost and Found Item Registry

A full-stack production-ready Lost and Found application with smart item matching, JWT authentication, real-time WebSocket notifications, and an Amazon-inspired UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Axios, React Router v6, React Toastify, CSS Modules |
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data MongoDB |
| Database | MongoDB 6+ |
| Auth | JWT (HS512) — 15min access + 7day refresh tokens |
| Real-time | WebSocket (STOMP over SockJS) |
| Build | Maven (backend), npm (frontend) |

---

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MongoDB 6+ running on `localhost:27017`

---

## Quick Start

### 1. Start MongoDB

```bash
mongod --dbpath /your/data/path
```

### 2. Backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend runs on **http://localhost:8080**

Seed data is auto-inserted on first run:
- Admin: `admin@findit.com` / `Admin@123`
- Staff: `staff@findit.com` / `Staff@123`
- Users: `alice@example.com`, `bob@example.com`, `carol@example.com` / `User@123`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

API proxy to backend is pre-configured in `vite.config.js`.

---

## Features

### Core
- Report lost and found items with photo upload
- Smart matching algorithm (category + location + keyword scoring)
- Claim submission with proof upload
- Admin/Staff approval workflow

### Matching Algorithm
Scores are computed as:
- **Category match**: 40 points (exact match)
- **Location similarity**: 30 points (Levenshtein distance)
- **Keyword overlap**: 30 points (Jaccard similarity on tokenized title+description)
- Matches with score ≥ 50 are saved and owners are notified

### Authentication
- JWT access tokens (15 min expiry)
- Refresh tokens (7 days)
- Roles: `ROLE_USER`, `ROLE_STAFF`, `ROLE_ADMIN`

### Real-time Notifications
- WebSocket (STOMP) push notifications on new matches and claim updates
- Notification bell with unread count in navbar

### File Upload
- Multipart upload to `./uploads/{userId}/{uuid}.ext`
- Supported: JPG, PNG, WEBP — max 5MB

---

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

### Lost Items
```
GET    /api/lost-items          ?keyword&category&location&status&page&size
POST   /api/lost-items          multipart/form-data
GET    /api/lost-items/{id}
PUT    /api/lost-items/{id}
DELETE /api/lost-items/{id}
GET    /api/lost-items/{id}/matches
```

### Found Items
```
GET    /api/found-items
POST   /api/found-items
GET    /api/found-items/{id}
PUT    /api/found-items/{id}
DELETE /api/found-items/{id}
```

### Claims
```
POST /api/claims                multipart/form-data
GET  /api/claims/my
GET  /api/claims/{id}
PUT  /api/claims/{id}/approve   ADMIN/STAFF
PUT  /api/claims/{id}/reject    ADMIN/STAFF
```

### Admin
```
GET /api/admin/stats
GET /api/admin/users
PUT /api/admin/users/{id}/role
GET /api/admin/items/pending
PUT /api/admin/items/{id}/approve?type=lost|found
PUT /api/admin/items/{id}/reject?type=lost|found
```

### Notifications
```
GET /api/notifications/my
PUT /api/notifications/{id}/read
WS  /ws  → /topic/notifications/{userId}
```

---

## Configuration

All config lives in `backend/src/main/resources/application.yml`.

For production, override via environment variables:
```bash
export JWT_SECRET=<your-256-bit-base64-secret>
export SPRING_DATA_MONGODB_URI=mongodb://user:pass@host:27017/lost_found_db
```

---

## Project Structure

```
Full/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/lostandfound/
│       │   ├── LostAndFoundApplication.java
│       │   ├── config/          (Security, WebSocket, Mongo, App, DataInitializer)
│       │   ├── controller/      (Auth, LostItem, FoundItem, Claim, Admin, Notification, File)
│       │   ├── service/         (Auth, User, LostItem, FoundItem, Claim, Matching, Notification, FileStorage)
│       │   ├── repository/      (User, LostItem, FoundItem, Claim, Match, Notification)
│       │   ├── model/           (User, LostItem, FoundItem, Claim, Match, Notification)
│       │   ├── dto/             (request/response DTOs)
│       │   ├── security/        (JwtTokenProvider, JwtAuthFilter, UserPrincipal)
│       │   └── exception/       (GlobalExceptionHandler, ResourceNotFound, Unauthorized)
│       └── resources/application.yml
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── api/                 (axiosInstance, authApi, lostItemApi, foundItemApi, claimApi, adminApi)
        ├── context/             (AuthContext, NotificationContext)
        ├── hooks/               (useAuth, usePagination, useDebounce)
        ├── components/          (layout, common, items, claims, admin)
        └── pages/               (Home, Login, Register, LostItems, FoundItems, ItemDetail, ReportLost, ReportFound, MyItems, MyClaims, Profile, AdminDashboard)
```
