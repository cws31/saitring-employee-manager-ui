SEMA — Sonu Saitring Employee Management System

A responsive React + Vite web application for managing employees, daily attendance, advances, monthly hisab, settlements, and organization profile information from a single owner/admin workspace.

The frontend communicates with a Spring Boot REST API through Axios and uses token-based authentication with an OTP verification step when required by the backend.

Live Application

The frontend is deployed on Render as saitring-manager-aap.onrender.com.

Features

Authentication & Account

Owner/admin registration

Login using email/identifier and password

OTP verification when requested by the backend

JWT/token-based authenticated sessions

Protected application routes

Automatic logout and redirect to /login after a 401 Unauthorized API response

Owner profile management

Organization details management

Organization logo upload and deletion

Employee Management

View all employees

Search employees by name or mobile number

Filter employees by active/blocked status

Add new employees

Edit employee information

Block/unblock employees

Delete employees

Attendance Management

Mark employee attendance

View attendance by month

View an individual employee's monthly attendance

Maintain attendance records through the backend API

Advance Management

Record employee advances

View monthly advances

Edit advance records

Delete advance records

Display financial amounts using Indian Rupee formatting

Dashboard

Owner dashboard

Month/year selection

Active employee overview

Total payable information

Total advance information

Over-advance information

Monthly management summary

Monthly Hisab & Settlements

View monthly employee hisab

Select year and month

Review employee presence, rate, earnings, advances, previous balance, and net payable

Track settlement records

Add settlement payments

Edit settlement payments

Delete settlement payments

Mark month-closing details as completed

User Interface

Responsive desktop and mobile layout

Landing page with product overview

Responsive navigation and mobile sidebar

Owner/organization branding

Reusable dashboard and employee components

Tailwind CSS styling

Lucide icons

Technology Stack

Technology

Purpose

React 19

Frontend UI framework

Vite 8

Development server and production build tool

React Router 7

Client-side routing and protected routes

Axios

REST API communication

Tailwind CSS 4

Styling and responsive UI

Lucide React

UI icons

Oxlint

JavaScript/React linting

Project Structure

saitring-employee-manager-ui/
├── public/
│   ├── app-logo.png
│   └── images/
│       └── landing-hero.png
│
├── src/
│   ├── api/
│   │   ├── advanceApi.js
│   │   ├── attendanceApi.js
│   │   ├── authApi.js
│   │   ├── axiosClient.js
│   │   ├── dashboardApi.js
│   │   ├── employeeApi.js
│   │   ├── monthClosingApi.js
│   │   └── settlementApi.js
│   │
│   ├── assets/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── DashboardCard.jsx
│   │   ├── employees/
│   │   │   └── EmployeeModal.jsx
│   │   ├── landing/
│   │   │   ├── CTA.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Security.jsx
│   │   └── layout/
│   │       ├── AppLayout.jsx
│   │       ├── Sidebar.jsx
│   │       └── Topbar.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── dashboard/
│   │   │   └── OwnerDashboard.jsx
│   │   ├── employees/
│   │   │   └── EmployeesPage.jsx
│   │   ├── attendance/
│   │   │   └── AttendancePage.jsx
│   │   ├── advances/
│   │   │   └── AdvancesPage.jsx
│   │   ├── monthClosing/
│   │   │   └── MonthClosingPage.jsx
│   │   ├── owner/
│   │   │   └── OwnerProfile.jsx
│   │   └── LandingPage.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── utils/
│   │   ├── currency.js
│   │   └── imageUrl.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md

Requirements

Install the following before running the project:

Node.js

npm

Git

A running instance of the SEMA Spring Boot backend

Check installed versions:

node --version
npm --version
git --version

Installation

Clone the repository:

git clone <YOUR_FRONTEND_REPOSITORY_URL>

Enter the project directory:

cd saitring-employee-manager-ui

Install dependencies:

npm install

Environment Configuration

The frontend reads the backend API URL from the Vite environment variable:

VITE_API_BASE_URL=http://localhost:8080/api

Create a .env file in the project root for local development:

VITE_API_BASE_URL=http://localhost:8080/api

For production, configure the variable with the deployed backend API URL, for example:

VITE_API_BASE_URL=https://your-backend-domain.example/api

src/api/axiosClient.js uses this value as the Axios baseURL.

Security Note

Vite variables beginning with VITE_ are bundled into the frontend application and can be visible to users.

Never store the following in frontend environment variables:

Database passwords

JWT signing secrets

Email passwords

Private API keys

Cloud credentials

Personal access tokens

Other confidential secrets

Only non-secret configuration, such as the public backend API URL, should be exposed to the frontend.

Running the Project

Development

Start the Vite development server:

npm run dev

Vite normally serves the application at:

http://localhost:5173

Make sure the backend API is running and accessible through VITE_API_BASE_URL.

Production Build

Create an optimized production build:

npm run build

The generated static files are placed in:

dist/

Preview Production Build

npm run preview

Lint

npm run lint

Available Scripts

Command

Description

npm run dev

Start the Vite development server

npm run build

Build the application for production

npm run preview

Preview the production build locally

npm run lint

Run Oxlint checks

Application Routes

Route

Purpose

Access

/

Public landing page

Public

/login

Owner login and OTP verification

Public

/register

Owner/organization registration

Public

/dashboard

Owner dashboard

Protected

/employees

Employee management

Protected

/attendance

Attendance management

Protected

/advances

Employee advance management

Protected

/month-closing

Monthly hisab and settlements

Protected

/profile

Owner and organization profile

Protected

All protected routes are wrapped by ProtectedRoute and require an authenticated token.

Authentication Flow

The application uses a token-based authentication flow managed by AuthContext.

Login

The owner enters an identifier/email and password.

The frontend calls the login API.

If the backend indicates that OTP verification is required, the UI displays the OTP screen.

The owner enters the six-digit OTP.

The frontend verifies the OTP.

On successful verification, the returned token and owner information are stored in browser storage.

The user can access protected application routes.

Token Handling

src/api/axiosClient.js:

Reads ownerToken from localStorage.

Adds it to authenticated requests using the Authorization: Bearer <token> header.

Clears authentication data after a 401 Unauthorized response.

Redirects the user to /login when the session is no longer valid.

Current Client-Side Storage

The current implementation stores the authentication token in localStorage.

For a higher-security production architecture, authentication can be redesigned around secure HttpOnly cookies, Secure cookies, appropriate SameSite settings, HTTPS, and CSRF protection where applicable.

Backend API Integration

All backend requests are centralized through Axios service modules under src/api/.

Authentication API

POST /owners/login
POST /owners/verify-otp
POST /owners/register
GET  /owners/{ownerId}/logo
GET  /owners/profile
PUT  /owners/profile
DELETE /owners/profile/logo

Employee API

GET    /employees
GET    /employees/{id}
POST   /employees
PUT    /employees/{id}
DELETE /employees/{id}
PATCH  /employees/{id}/toggle-block

Attendance API

POST /attendance
GET  /attendance/month
GET  /attendance/employee/{employeeId}

Advance API

POST   /advances
PUT    /advances/{id}
DELETE /advances/{id}
GET    /advances/monthly

Dashboard API

GET /dashboard

The dashboard request accepts year and month query parameters.

Month Closing API

GET /month-closings
GET /month-closings/{id}
GET /month-closings/year/{year}/month/{month}
GET /month-closings/search
PUT /month-closings/detail/{detailId}/complete

Settlement API

POST   /settlements
GET    /settlements
GET    /settlements/employee/{employeeId}
PUT    /settlements/{id}
DELETE /settlements/{id}

The settlement functionality is integrated into the monthly hisab/month-closing interface rather than exposed as a separate frontend route.

Main Application Modules

Landing Page

The public landing page introduces the system and provides navigation to registration and login.

It includes:

Hero section

Feature overview

How-it-works section

Security information

Call-to-action section

Footer

Owner Dashboard

The dashboard provides a monthly overview of the organization and employee financial information.

Users can select a year and month to retrieve dashboard data from the backend.

Employees

The employee module provides:

Employee listing

Search by name or mobile number

Active/blocked filtering

Employee creation

Employee editing

Block/unblock functionality

Employee deletion

Attendance

The attendance module allows the owner to mark attendance and retrieve monthly attendance records. Employee-specific monthly attendance can also be requested through the backend API.

Advances

The advance module records money given to employees and provides monthly filtering, editing, and deletion of advance records.

Month Closing / Hisab

The month-closing module combines monthly employee calculations with settlement management.

It displays information such as:

Employee

Presence

Rate

Earning

Advance

Previous balance

Net payable

Settlement records

Remaining amount

Monthly details can also be marked as completed.

Owner Profile

The profile module allows the owner to manage:

Owner name

Organization name

Email

Mobile number

Website

Address

Organization logo

Currency Formatting

Financial values are formatted using the Indian locale and INR currency through:

src/utils/currency.js

The application uses Intl.NumberFormat with the en-IN locale and INR currency.

Responsive Design

The application is designed for desktop and mobile screens.

The authenticated area includes:

Desktop sidebar navigation

Mobile slide-out navigation

Responsive topbar

Responsive dashboard cards

Mobile-friendly forms and tables

Tailwind CSS is used for the majority of the UI styling.

CORS

Because the frontend communicates with a separate backend, the backend must allow requests from the frontend origin.

For local development, the frontend origin is normally:

http://localhost:5173

For production, configure CORS to allow only the actual deployed frontend domain.

Avoid allowing all origins (*) for authenticated production APIs.

Local Development Architecture

┌─────────────────────────────┐
│ React + Vite Frontend       │
│                             │
│ localhost:5173              │
└──────────────┬──────────────┘
               │
               │ HTTPS/HTTP REST API
               ▼
┌─────────────────────────────┐
│ Spring Boot Backend         │
│                             │
│ Configured through          │
│ VITE_API_BASE_URL           │
└──────────────┬──────────────┘
               │
               │ Database/API layer
               ▼
┌─────────────────────────────┐
│ Backend Data Store          │
└─────────────────────────────┘

The frontend itself does not directly connect to the database. All application data is accessed through the backend REST API.

Production Deployment

The frontend is a Vite application and can be deployed as static files.

Typical deployment flow:

React Source Code
       │
       ▼
 npm run build
       │
       ▼
     dist/
       │
       ▼
Static Hosting / Render / Nginx

The production environment must provide the correct VITE_API_BASE_URL value during the build/deployment process.

Render Deployment

For a static frontend deployment on Render, configure the project approximately as follows:

Build Command:
npm install && npm run build

Publish Directory:
dist

Set the required environment variable:

VITE_API_BASE_URL=<YOUR_DEPLOYED_BACKEND_API_URL>

The exact backend URL depends on where the Spring Boot API is deployed.

SPA Routing

The application uses React Router for client-side navigation.

A production static host must serve the application's index.html for frontend routes when a user directly opens a route such as:

/dashboard
/employees
/attendance
/advances
/month-closing
/profile

Without SPA fallback configuration, directly refreshing a nested route may return a server-side 404.

Environment Separation

Recommended environment structure:

Development
    └── localhost

Staging
    └── staging frontend + staging API

Production
    └── production frontend + production API

Use a different VITE_API_BASE_URL for each environment.

Git Workflow

Check repository status:

git status

Stage changes:

git add .

Commit changes:

git commit -m "Update frontend"

Push changes:

git push origin main

Files That Should Not Be Committed

The repository should not commit generated dependencies, build output, or secrets.

Recommended ignored files/directories include:

node_modules/
dist/
.env
.env.*
.DS_Store

Do not commit:

Passwords

JWT secrets

Database credentials

Private API keys

Cloud credentials

Personal access tokens

Private certificates

Deployment Checklist

Before production deployment:

Configure VITE_API_BASE_URL

Confirm the production backend is reachable

Configure backend CORS

Build the frontend successfully with npm run build

Configure SPA fallback

Enable HTTPS

Verify authentication and OTP flow

Verify employee management

Verify attendance

Verify advances

Verify month closing and settlements

Verify owner profile and logo upload

Confirm no secrets are exposed in the frontend

Test desktop and mobile layouts

Production Testing Checklist

Authentication

Registration works

Login works

OTP verification works when required

Invalid credentials are rejected

Protected routes redirect unauthenticated users to /login

Expired/invalid sessions are handled correctly

Logout clears the local authentication state

Employees

Employee list loads

Search works

Active/blocked filtering works

Employee creation works

Employee editing works

Block/unblock works

Employee deletion works

Attendance

Monthly attendance loads

Attendance can be marked

Employee-specific attendance loads correctly

Attendance data matches backend records

Advances

Monthly advances load

New advances can be created

Advances can be edited

Advances can be deleted

Amounts are displayed correctly in INR

Month Closing & Settlements

Monthly hisab loads

Employee calculations display correctly

Settlement can be created

Settlement can be edited

Settlement can be deleted

Month-closing detail can be marked completed

Profile

Owner profile loads

Profile details can be updated

Organization logo can be uploaded

Organization logo can be deleted

General

Production API connection works

CORS is correctly configured

Browser refresh works on protected routes

Responsive layout works on mobile

HTTPS works correctly

No confidential secrets are exposed

Troubleshooting

API requests fail

Check that:

VITE_API_BASE_URL is configured correctly.

The backend is running and reachable.

The backend CORS configuration allows the frontend origin.

The requested API endpoint matches the backend API.

The user has a valid authentication token for protected endpoints.

User is redirected to login

The Axios response interceptor clears the stored authentication state when the backend returns 401 Unauthorized.

Log in again and verify that the backend is issuing a valid token.

Images or organization logos do not load

Check:

Backend logo endpoint availability

Authentication token validity

Backend CORS configuration

VITE_API_BASE_URL

The logo response/content type

Refreshing a frontend route returns 404

Configure SPA fallback on the production hosting provider so unknown frontend routes serve index.html.

Security Considerations

This frontend handles authenticated employee and financial information, so production deployment should use:

HTTPS

Strict backend CORS rules

Secure backend authentication

Proper token/session expiration

Strong owner passwords

Server-side authorization

Secure handling of uploaded files

No secrets in frontend source or VITE_* variables

Regular dependency updates

Client-side route protection is only a UI convenience. Authorization must always be enforced by the backend API.

Related Backend

This frontend is designed to communicate with the project's Spring Boot backend through the REST endpoints listed in this README.

The backend is responsible for:

Authentication and authorization

OTP processing

Employee data

Attendance records

Advances

Monthly calculations

Settlements

Owner profile data

Database operations

The frontend should be considered the presentation/client layer of the overall SEMA system.

Development Notes

Do not commit node_modules/.

Do not commit .env files containing private configuration.

Keep frontend API service modules synchronized with backend endpoint changes.

If backend request/response models change, update the corresponding React API modules and pages.

Run linting before committing significant changes.

Run a production build before deployment.

License

This project is intended for personal/business use.

Add an appropriate open-source license if the project is distributed publicly.

Author

Sonu Saitring Management System

Frontend developed using:

React

Vite

Tailwind CSS

Axios

React Router

Lucide React