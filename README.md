
# GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack.

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Zustand, TanStack Query
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Auth:** JWT + bcrypt
- **DevOps:** Docker, Docker Compose

## Features

- JWT Authentication with Role-Based Access Control (Admin / Sales)
- Full Lead CRUD (Create, Read, Update, Delete)
- Advanced filtering by Status, Source, Sort
- Debounced search by name or email
- Backend pagination (10 records per page)
- CSV Export
- View single lead details
- Dark mode support
- Responsive design

## Roles

| Feature | Admin | Sales |
|---------|-------|-------|
| View Leads | ✅ | ✅ |
| Add Lead | ✅ | ✅ |
| Edit Lead | ✅ | ✅ |
| Delete Lead | ✅ | ❌ |

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

### Docker
```bash
docker-compose up --build
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/leads | Get all leads | Yes |
| POST | /api/leads | Create lead | Yes |
| PUT | /api/leads/:id | Update lead | Yes |
| DELETE | /api/leads/:id | Delete lead | Admin only |
| GET | /api/leads/export | Export CSV | Yes |

## Environment Variables

### Server (.env)
| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |
| JWT_EXPIRES_IN | Token expiry e.g. 7d |
| PORT | Server port default 5000 |

### Client (.env)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |