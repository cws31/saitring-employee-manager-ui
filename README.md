Sonu Saitring Management System — Frontend

React + Vite frontend for the Sonu Saitring Management System.
This application provides the web interface for employee management, attendance, advances, settlements/month closing (Hisab), and authentication.

The frontend communicates with the Spring Boot backend through Axios and stores the JWT authentication token in browser localStorage.

Features

User login and JWT-based authentication

Protected application routes

Employee management

Attendance management

Employee advances

Hisab / month closing

Settlement-related UI

Dashboard

Responsive navigation

Automatic logout/redirect when the backend returns 401 or 403

Technology Stack

Technology

Purpose

React 19

UI framework

Vite 8

Development server and production build

React Router 7

Client-side routing

Axios

Backend API communication

Tailwind CSS 4

Styling

Oxlint

JavaScript/React linting

Project Structure

sonu-saitring-ui/
├── public/
├── src/
│   ├── api/
│   │   ├── advanceService.js
│   │   ├── attendanceService.js
│   │   ├── authService.js
│   │   ├── axiosInstance.js
│   │   ├── employeeService.js
│   │   ├── HisabService.js
│   │   └── settlementService.js
│   │
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── advances/
│   │   ├── attendance/
│   │   ├── employees/
│   │   ├── Hisab/
│   │   ├── Dashboard.jsx
│   │   └── LoginPage.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── .gitignore
└── README.md

Requirements

Install the following before running the project:

Node.js

npm

Git

A running instance of the Sonu Saitring Management System Spring Boot backend

Check your versions:

node --version
npm --version
git --version

Installation

Clone the repository:

git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd sonu-saitring-ui

Install dependencies:

npm install

node_modules should not be committed to Git. The dependencies are restored using npm install.

Backend API Configuration

The current frontend Axios configuration uses:

http://localhost:8080

The configuration is currently located in:

src/api/axiosInstance.js

For local development, make sure the Spring Boot backend is running on port 8080.

Example:

Frontend: http://localhost:5173
Backend:  http://localhost:8080

For production deployment, replace the hard-coded backend URL with a production environment variable, for example:

VITE_API_BASE_URL=https://api.example.com

Then configure Axios to use:

baseURL: import.meta.env.VITE_API_BASE_URL

Do not place passwords, database credentials, JWT secrets, email passwords, or other private credentials in frontend source code or Vite environment variables intended for client-side use. Vite VITE_* variables are bundled into the browser application and should be treated as public.

Run the Development Server

Start Vite:

npm run dev

The development server normally runs at:

http://localhost:5173

Open the displayed URL in your browser.

Available Scripts

Start development server

npm run dev

Create production build

npm run build

Preview production build locally

npm run preview

Run linting

npm run lint

Production Build

Create the optimized production files:

npm run build

Vite generates the production build in:

dist/

The dist/ directory can be served by a static web server such as Nginx.

Authentication

The application uses JWT authentication.

The Axios request interceptor:

Reads the JWT token from browser localStorage.

Adds the token to the request.

Sends it using the Authorization header.

The frontend accepts either a token value or a token that already starts with:

Bearer

When the backend responds with 401 Unauthorized or 403 Forbidden, the frontend removes the stored token and redirects the user to:

/login

Important Security Note

The current implementation stores the JWT in localStorage.

For a production deployment, review the authentication architecture carefully. Depending on the application's threat model, an HttpOnly, Secure, SameSite cookie-based authentication design can provide better protection against token theft through XSS.

Application Routes

Route

Purpose

Authentication

/login

Login page

Public

/

Dashboard

Protected

/employees

Employee management

Protected

/attendance

Attendance management

Protected

/advances

Employee advances

Protected

/month-closing

Hisab / month closing

Protected

Backend Integration

The frontend expects the Spring Boot backend to provide the corresponding REST APIs.

Main backend areas include:

Authentication

Employees

Attendance

Advances

Settlements

Month Closing / Hisab

The frontend service modules under:

src/api/

contain the API communication logic.

CORS

During local development, the backend should allow the frontend development origin, typically:

http://localhost:5173

For production, configure CORS to allow only the actual production frontend domain.

Avoid using a wildcard origin such as:

*

for authenticated production APIs.

Deployment Architecture

The intended production architecture is:

                    Internet
                       │
                       ▼
              HTTPS / Domain
                       │
                       ▼
              React + Vite UI
                 Static Files
                       │
                       │ HTTPS API calls
                       ▼
              Spring Boot Backend
                       │
                       ▼
                 MySQL Database

The frontend should be deployed as static files, while the Spring Boot backend runs separately.

Recommended Production Setup

For the planned deployment:

Frontend
   │
   └── React + Vite
       └── Nginx / Static hosting

Backend
   │
   └── Spring Boot + Java 21
       └── HTTPS API

Database
   │
   └── MySQL

The frontend should communicate with the backend through an HTTPS API URL.

Example:

https://app.example.com
https://api.example.com

SPA Routing

Because React Router is used, the production web server must return index.html for application routes that are handled by React.

For example:

/employees
/attendance
/advances
/month-closing

When deploying with Nginx, configure the SPA fallback so that unknown frontend routes are redirected to index.html.

Environment Separation

Recommended environments:

Development
    localhost

Testing / Staging
    staging.example.com

Production
    app.example.com

Do not commit environment-specific secrets or private configuration files.

For Vite, remember that values exposed through VITE_* are visible to users in the built frontend.

Git Workflow

Typical workflow:

git status

git add .

git commit -m "Update frontend"

git push origin main

Before committing, verify that you are not committing:

node_modules/
dist/
.env
.env.*

and any other files containing private information.

Deployment Checklist

Before production deployment:

Replace the localhost API URL

Configure production VITE_API_BASE_URL

Configure backend CORS for the production frontend domain

Build the application with npm run build

Verify the generated dist/ directory

Configure HTTPS

Configure SPA routing/fallback

Test login

Test protected routes

Test employee management

Test attendance

Test advances

Test Hisab/month closing

Verify logout/expired-token behavior

Verify mobile/responsive behavior

Confirm no secrets are included in the frontend build or repository

Development Roadmap

React/Vite frontend implementation

Authentication UI

Employee management UI

Attendance UI

Advances UI

Hisab/month closing UI

Production API configuration

Production CORS configuration

Production frontend deployment

HTTPS integration

Domain configuration

Production monitoring

Deployment documentation

Related Backend

This frontend is designed to work with the Sonu Saitring Management System Spring Boot backend.

The backend uses:

Java 21

Spring Boot

Spring Security

JWT authentication

Spring Data JPA

MySQL

Keep the backend and frontend API contracts synchronized when changing request/response models.

License

This project is intended for personal/business use.

Add the appropriate license here if the project will be distributed publicly.

Author

Sonu Saitring Management System

Frontend built with React, Vite, and Tailwind CSS.