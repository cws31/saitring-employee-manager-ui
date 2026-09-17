# SEMA — Sonu Saitring Employee Management System

A responsive React + Vite web application for managing employees, daily attendance, advances, monthly hisab, settlements, and organization profile information from a single owner/admin workspace.

The frontend communicates with a Spring Boot REST API through Axios and uses token-based authentication with an OTP verification step when required by the backend.

## Live Application

The frontend is deployed on Render as [saitring-manager-aap.onrender.com](https://saitring-manager-aap.onrender.com).

## Features

### Authentication & Account
* Owner/admin registration
* Login using email/identifier and password
* OTP verification when requested by the backend
* JWT/token-based authenticated sessions
* Protected application routes
* Automatic logout and redirect to `/login` after a 401 Unauthorized API response
* Owner profile management
* Organization details management
* Organization logo upload and deletion

### Employee Management
* View all employees
* Search employees by name or mobile number
* Filter employees by active/blocked status
* Add new employees
* Edit employee information
* Block/unblock employees
* Delete employees

### Attendance Management
* Mark employee attendance
* View attendance by month
* View an individual employee's monthly attendance
* Maintain attendance records through the backend API

### Advance Management
* Record employee advances
* View monthly advances
* Edit advance records
* Delete advance records
* Display financial amounts using Indian Rupee formatting

### Dashboard
* Owner dashboard
* Month/year selection
* Active employee overview
* Total payable information
* Total advance information
* Over-advance information
* Monthly management summary

### Monthly Hisab & Settlements
* View monthly employee hisab
* Select year and month
* Review employee presence, rate, earnings, advances, previous balance, and net payable
* Track settlement records
* Add settlement payments
* Edit settlement payments
* Delete settlement payments
* Mark month-closing details as completed

### User Interface
* Responsive desktop and mobile layout
* Landing page with product overview
* Responsive navigation and mobile sidebar
* Owner/organization branding
* Reusable dashboard and employee components
* Tailwind CSS styling
* Lucide icons

## Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Frontend UI framework |
| **Vite 8** | Development server and production build tool |
| **React Router 7** | Client-side routing and protected routes |
| **Axios** | REST API communication |
| **Tailwind CSS 4** | Styling and responsive UI |
| **Lucide React** | UI icons |
| **Oxlint** | JavaScript/React linting |

## Project Structure

```text
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
```

## Requirements

Install the following before running the project:
* Node.js
* npm
* Git
* A running instance of the SEMA Spring Boot backend

Check installed versions:
```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:
```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
```

Enter the project directory:
```bash
cd saitring-employee-manager-ui
```

Install dependencies:
```bash
npm install
```

## Environment Configuration

The frontend reads the backend API URL from the Vite environment variable:
`VITE_API_BASE_URL=http://localhost:8080/api`

Create a `.env` file in the project root for local development:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For production, configure the variable with the deployed backend API URL, for example:
```env
VITE_API_BASE_URL=[https://your-backend-domain.example/api](https://your-backend-domain.example/api)
```

`src/api/axiosClient.js` uses this value as the Axios `baseURL`.

> **Security Note:**
> Vite variables beginning with `VITE_` are bundled into the frontend application and can be visible to users. Never store the following in frontend environment variables:
> * Database passwords
> * JWT signing secrets
> * Email passwords
> * Private API keys
> * Cloud credentials
> * Personal access tokens
> * Other confidential secrets
> 
> Only non-secret configuration, such as the public backend API URL, should be exposed to the frontend.

## Running the Project

### Development
Start the Vite development server:
```bash
npm run dev
```
Vite normally serves the application at: `http://localhost:5173`. Make sure the backend API is running and accessible through `VITE_API_BASE_URL`.

### Production Build
Create an optimized production build:
```bash
npm run build
```
The generated static files are placed in: `dist/`

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint checks |

## Application Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Public landing page | Public |
| `/login` | Owner login and OTP verification | Public |
| `/register` | Owner/organization registration | Public |
| `/dashboard` | Owner dashboard | Protected |
| `/employees` | Employee management | Protected |
| `/attendance` | Attendance management | Protected |
| `/advances` | Employee advance management | Protected |
| `/month-closing` | Monthly hisab and settlements | Protected |
| `/profile` | Owner and organization profile | Protected |

*All protected routes are wrapped by `ProtectedRoute` and require an authenticated token.*

## Authentication Flow

The application uses a token-based authentication flow managed by `AuthContext`.

1. **Login:** The owner enters an identifier/email and password.
2. The frontend calls the login API.
3. If the backend indicates that OTP verification is required, the UI displays the OTP screen.
4. The owner enters the six-digit OTP.
5. The frontend verifies the OTP.
6. On successful verification, the returned token and owner information are stored in browser storage.
7. The user can access protected application routes.

### Token Handling
`src/api/axiosClient.js`:
* Reads `ownerToken` from localStorage.
* Adds it to authenticated requests using the `Authorization: Bearer <token>` header.
* Clears authentication data after a 401 Unauthorized response.
* Redirects the user to `/login` when the session is no longer valid.

### Current Client-Side Storage
The current implementation stores the authentication token in `localStorage`. For a higher-security production architecture, authentication can be redesigned around secure `HttpOnly` cookies, `Secure` cookies, appropriate `SameSite` settings, HTTPS, and CSRF protection where applicable.

## Backend API Integration

All backend requests are centralized through Axios service modules under `src/api/`.

### Authentication API
* `POST /owners/login`
* `POST /owners/verify-otp`
* `POST /owners/register`
* `GET  /owners/{ownerId}/logo`
* `GET  /owners/profile`
* `PUT  /owners/profile`
* `DELETE /owners/profile/logo`

### Employee API
* `GET    /employees`
* `GET    /employees/{id}`
* `POST   /employees`
* `PUT    /employees/{id}`
* `DELETE /employees/{id}`
* `PATCH  /employees/{id}/toggle-block`

### Attendance API
* `POST /attendance`
* `GET  /attendance/month`
* `GET  /attendance/employee/{employeeId}`

### Advance API
* `POST   /advances`
* `PUT    /advances/{id}`
* `DELETE /advances/{id}`
* `GET    /advances/monthly`

### Dashboard API
* `GET /dashboard`
*(The dashboard request accepts year and month query parameters.)*

### Month Closing API
* `GET /month-closings`
* `GET /month-closings/{id}`
* `GET /month-closings/year/{year}/month/{month}`
* `GET /month-closings/search`
* `PUT /month-closings/detail/{detailId}/complete`

### Settlement API
* `POST   /settlements`
* `GET    /settlements`
* `GET    /settlements/employee/{employeeId}`
* `PUT    /settlements/{id}`
* `DELETE /settlements/{id}`
*(The settlement functionality is integrated into the monthly hisab/month-closing interface rather than exposed as a separate frontend route.)*

## Main Application Modules

### Landing Page
The public landing page introduces the system and provides navigation to registration and login. It includes:
* Hero section
* Feature overview
* How-it-works section
* Security information
* Call-to-action section
* Footer

### Owner Dashboard
The dashboard provides a monthly overview of the organization and employee financial information. Users can select a year and month to retrieve dashboard data from the backend.

### Employees
The employee module provides:
* Employee listing
* Search by name or mobile number
* Active/blocked filtering
* Employee creation & editing
* Block/unblock functionality
* Employee deletion

### Attendance
The attendance module allows the owner to mark attendance and retrieve monthly attendance records. Employee-specific monthly attendance can also be requested through the backend API.

### Advances
The advance module records money given to employees and provides monthly filtering, editing, and deletion of advance records.

### Month Closing / Hisab
The month-closing module combines monthly employee calculations with settlement management. It displays information such as:
* Employee Presence, Rate, Earning
* Advance, Previous balance, Net payable
* Settlement records & Remaining amount
* *Monthly details can also be marked as completed.*

### Owner Profile
The profile module allows the owner to manage:
* Owner name & Organization name
* Email & Mobile number
* Website & Address
* Organization logo

## Currency Formatting
Financial values are formatted using the Indian locale and INR currency through `src/utils/currency.js`. The application uses `Intl.NumberFormat` with the `en-IN` locale and `INR` currency.

## Responsive Design
The application is designed for desktop and mobile screens. The authenticated area includes:
* Desktop sidebar navigation
* Mobile slide-out navigation
* Responsive topbar & dashboard cards
* Mobile-friendly forms and tables
* Tailwind CSS is used for the majority of the UI styling.

## CORS
Because the frontend communicates with a separate backend, the backend must allow requests from the frontend origin.
* **Local development:** Typically `http://localhost:5173`
* **Production:** Configure CORS to allow only the actual deployed frontend domain. Avoid allowing all origins (`*`) for authenticated production APIs.

## Local Development Architecture

```text
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
```
*The frontend itself does not directly connect to the database. All application data is accessed through the backend REST API.*

## Production Deployment
The frontend is a Vite application and can be deployed as static files.

**Typical deployment flow:**
`React Source Code` ➞ `npm run build` ➞ `dist/` ➞ `Static Hosting / Render / Nginx`

The production environment must provide the correct `VITE_API_BASE_URL` value during the build/deployment process.

### Render Deployment
For a static frontend deployment on Render, configure the project approximately as follows:
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`
* **Environment Variable:** `VITE_API_BASE_URL=<YOUR_DEPLOYED_BACKEND_API_URL>`

### SPA Routing
The application uses React Router for client-side navigation. A production static host must serve the application's `index.html` for frontend routes when a user directly opens a route (e.g., `/dashboard`, `/employees`). Without SPA fallback configuration, directly refreshing a nested route may return a server-side 404.

### Environment Separation
Recommended environment structure:
* **Development:** `localhost`
* **Staging:** `staging frontend + staging API`
* **Production:** `production frontend + production API`
*(Use a different `VITE_API_BASE_URL` for each environment.)*

## Git Workflow
1. Check repository status: `git status`
2. Stage changes: `git add .`
3. Commit changes: `git commit -m "Update frontend"`
4. Push changes: `git push origin main`

### Files That Should Not Be Committed
The repository should not commit generated dependencies, build output, or secrets.
**Recommended ignored files (`.gitignore`):**
```text
node_modules/
dist/
.env
.env.*
.DS_Store
```
**Do not commit:** Passwords, JWT secrets, Database credentials, Private API keys, Cloud credentials, Personal access tokens, Private certificates.

## Deployment Checklist
* Configure `VITE_API_BASE_URL`
* Confirm the production backend is reachable
* Configure backend CORS
* Build the frontend successfully with `npm run build`
* Configure SPA fallback
* Enable HTTPS
* Verify authentication and OTP flow
* Verify all major modules (employees, attendance, advances, month closing, profile)
* Confirm no secrets are exposed in the frontend
* Test desktop and mobile layouts

## Production Testing Checklist
* **Authentication:** Registration, Login, OTP, Invalid credentials, Protected routes redirect, Logout clears state.
* **Employees:** List loads, Search/Filter works, CRUD operations function correctly.
* **Attendance:** Monthly view loads, Marking works, Data matches backend.
* **Advances:** Monthly loads, CRUD operations work, Amounts display in INR.
* **Month Closing:** Hisab loads, Calculations correct, Settlements work, Closing completes.
* **Profile:** Loads, Updates work, Logo upload/deletion works.
* **General:** CORS is configured, Browser refresh works (SPA fallback), Responsive layout holds, No secrets exposed.

## Troubleshooting

**API requests fail**
* Check `VITE_API_BASE_URL` configuration.
* Ensure backend is running and reachable.
* Check backend CORS configuration.
* Verify authentication token for protected endpoints.

**User is redirected to login**
* The Axios response interceptor clears auth state on a 401 response. Log in again and verify the backend is issuing a valid token.

**Images or logos do not load**
* Check backend endpoint availability, token validity, CORS, and `VITE_API_BASE_URL`.

**Refreshing a frontend route returns 404**
* Configure SPA fallback on the production hosting provider so unknown routes serve `index.html`.

## Security Considerations
Because this handles authenticated financial info, production must use:
* HTTPS
* Strict backend CORS rules
* Secure backend authentication & token expiration
* Strong passwords & Server-side authorization
* Secure file handling
* No secrets in frontend source or `VITE_*` variables
* Client-side route protection is a UI convenience; authorization must be enforced by the backend API.

## Related Backend
This frontend is the presentation layer for the SEMA system and communicates with a Spring Boot backend responsible for:
* Auth, OTP, Database operations
* Employee, Attendance, Advance, Settlement, and Profile data logic

## Development Notes
* Do not commit `node_modules/` or private `.env` files.
* Keep frontend API service modules synchronized with backend endpoint changes.
* Run linting (`npm run lint`) before committing.
* Run a production build before deployment.

## License
This project is intended for personal/business use. Add an appropriate open-source license if the project is distributed publicly.

## Author
Sonu Saitring Management System

*Frontend developed using: React, Vite, Tailwind CSS, Axios, React Router, Lucide React.*