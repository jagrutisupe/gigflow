GigFlow – Smart Leads Dashboard
A full-stack Lead Management Dashboard built with the MERN stack.
Tech Stack

Frontend: React, TypeScript, TailwindCSS, Zustand, TanStack Query
Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
Auth: JWT + bcrypt
Deployment: Vercel (frontend), Render (backend), Docker


Prerequisites

Node.js 18+
MongoDB running locally
npm


Local Setup
1. Clone the repository
bashgit clone https://github.com/jagrutisupe/gigflow.git
cd gigflow
2. Backend
bashcd server
npm install
cp .env.example .env
npm run dev
Backend runs at: http://localhost:5000
3. Frontend
Open a new terminal:
bashcd client
npm install
cp .env.example .env
npm run dev
Frontend runs at: http://localhost:5173

Docker Setup
bashdocker-compose up --build

Environment Variables
Server (server/.env)
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
Client (client/.env)
VITE_API_URL=http://localhost:5000/api

API Endpoints
MethodEndpointDescriptionAuthPOST/api/auth/registerRegister userNoPOST/api/auth/loginLogin userNoGET/api/leadsGet all leadsYesPOST/api/leadsCreate leadYesPUT/api/leads/:idUpdate leadYesDELETE/api/leads/:idDelete leadAdmin onlyGET/api/leads/exportExport CSVYes

Roles
FeatureAdminSalesView Leads✅✅Add Lead✅✅Edit Lead✅✅Delete Lead✅❌

Live Demo

Frontend: https://gigflow-phi-peach.vercel.app
Backend: https://gigflow-server-tfv9.onrender.com