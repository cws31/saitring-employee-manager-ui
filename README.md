# Sonu Saitring Management System — Frontend

React + Vite frontend for the **Sonu Saitring Management System**.

This application provides the web interface for employee management, attendance, advances, settlements/month closing (Hisab), and authentication.

The frontend communicates with the Spring Boot backend through Axios and uses JWT-based authentication.

---

## Features

* User login and JWT-based authentication
* Protected application routes
* Employee management
* Attendance management
* Employee advances
* Hisab / month closing
* Settlement-related UI
* Dashboard
* Responsive navigation
* Automatic logout/redirect when the backend returns `401` or `403`

---

## Technology Stack

| Technology     | Purpose                                 |
| -------------- | --------------------------------------- |
| React 19       | UI framework                            |
| Vite 8         | Development server and production build |
| React Router 7 | Client-side routing                     |
| Axios          | Backend API communication               |
| Tailwind CSS 4 | Styling                                 |
| Oxlint         | JavaScript/React linting                |

---

## Project Structure

```text
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
```

---

## Requirements

Before running the project, install:

* Node.js
* npm
* Git
* A running instance of the Sonu Saitring Management System Spring Boot backend

Check the installed versions:

```bash
node --version
npm --version
git --version
```

---

## Installation

Clone the repository:

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
```

Move into the project:

```bash
cd sonu-saitring-ui
```

Install dependencies:

```bash
npm install
```

> `node_modules` should not be committed to Git. Dependencies should be restored using `npm install`.

---

## Backend API Configuration

The frontend currently communicates with the Spring Boot backend using:

```text
http://localhost:8080
```

The Axios configuration is located at:

```text
src/api/axiosInstance.js
```

For local development, make sure the Spring Boot backend is running on port `8080`.

Example local setup:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8080
```

---

## Production API Configuration

For production deployment, the backend URL should not remain hard-coded.

Recommended configuration:

```env
VITE_API_BASE_URL=https://api.example.com
```

Then Axios should use:

```javascript
baseURL: import.meta.env.VITE_API_BASE_URL
```

### Important Security Note

Vite environment variables beginning with:

```text
VITE_
```

are included in the frontend JavaScript bundle and can be visible to users.

Therefore, **never put secrets in frontend environment variables**.

Do not store:

* Database passwords
* JWT signing secrets
* Email passwords
* API private keys
* Cloud credentials
* Other confidential information

in the React/Vite frontend.

Only public configuration such as an API base URL should be exposed.

---

## Run Development Server

Start the development server:

```bash
npm run dev
```

Vite normally starts at:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Preview Production Build

```bash
npm run preview
```

Runs the production build locally for testing.

### Lint

```bash
npm run lint
```

Runs the project's linting checks.

---

## Production Build

Create the production build:

```bash
npm run build
```

The generated files will be placed inside:

```text
dist/
```

The `dist/` directory contains the static files that can be served using a production web server such as Nginx.

---

## Authentication

The application uses JWT-based authentication.

The Axios request interceptor:

1. Reads the JWT token from browser storage.
2. Adds the token to API requests.
3. Sends the token through the `Authorization` header.

The frontend handles expired or invalid authentication responses.

When the backend returns:

```text
401 Unauthorized
```

or:

```text
403 Forbidden
```

the frontend removes the stored authentication token and redirects the user to:

```text
/login
```

---

## Authentication Security

The current implementation stores the JWT token in browser `localStorage`.

This is convenient for development, but production authentication should be reviewed carefully.

For a stronger production security model, consider using:

* `HttpOnly` cookies
* `Secure` cookies
* `SameSite` cookie protection
* Proper CSRF protection where required
* HTTPS everywhere

The final authentication architecture should be selected based on the application's security requirements.

---

## Application Routes

| Route            | Purpose               | Authentication |
| ---------------- | --------------------- | -------------- |
| `/login`         | Login page            | Public         |
| `/`              | Dashboard             | Protected      |
| `/employees`     | Employee management   | Protected      |
| `/attendance`    | Attendance management | Protected      |
| `/advances`      | Employee advances     | Protected      |
| `/month-closing` | Hisab / month closing | Protected      |

---

## Backend API Integration

The frontend communicates with the Spring Boot backend through API service modules.

The main API services are located under:

```text
src/api/
```

These include:

```text
advanceService.js
attendanceService.js
authService.js
axiosInstance.js
employeeService.js
HisabService.js
settlementService.js
```

These services should remain synchronized with the backend REST API.

If backend request or response models change, the corresponding frontend API/service code may also need to be updated.

---

## Main Application Modules

### Authentication

Handles:

* Login
* JWT authentication
* Authentication state
* Protected routes
* Logout/expired-token handling

### Employees

Handles:

* Employee listing
* Employee creation
* Employee updates
* Employee-related information

### Attendance

Handles:

* Attendance records
* Attendance management
* Attendance-related calculations and views

### Advances

Handles:

* Employee advances
* Advance records
* Advance management

### Hisab / Month Closing

Handles:

* Monthly calculations
* Month closing
* Employee settlement-related information

### Dashboard

Provides the main application overview after login.

---

## CORS

During local development, the Spring Boot backend should allow the frontend development origin:

```text
http://localhost:5173
```

For production, configure CORS to allow only the actual frontend domain.

Example:

```text
https://app.example.com
```

Avoid using:

```text
*
```

as the allowed origin for authenticated production APIs.

---

## Local Development Architecture

The local application consists of:

```text
┌───────────────────────────┐
│ React + Vite              │
│                           │
│ localhost:5173            │
└─────────────┬─────────────┘
              │
              │ HTTP API
              ▼
┌───────────────────────────┐
│ Spring Boot               │
│                           │
│ localhost:8080            │
└─────────────┬─────────────┘
              │
              │ JDBC
              ▼
┌───────────────────────────┐
│ MySQL                     │
│                           │
│ worker_management_db      │
└───────────────────────────┘
```

---

## Production Architecture

The planned production architecture is:

```text
                    Internet
                       │
                       ▼
              HTTPS / Domain
                       │
                       ▼
              React + Vite UI
                 Static Files
                       │
                       │ HTTPS API
                       ▼
              Spring Boot Backend
                       │
                       │ JDBC
                       ▼
                  MySQL DB
```

The frontend and backend should be deployed separately.

---

## Recommended Production Setup

### Frontend

```text
React + Vite
     │
     ▼
npm run build
     │
     ▼
dist/
     │
     ▼
Nginx / Static Web Server
```

### Backend

```text
Spring Boot
     │
     ▼
Java 21
     │
     ▼
HTTPS API
```

### Database

```text
MySQL
```

The frontend communicates with the backend using HTTPS.

Example:

```text
Frontend:
https://app.example.com

Backend:
https://api.example.com
```

---

## SPA Routing

This application uses React Router.

Therefore, the production web server must support SPA routing.

Routes such as:

```text
/employees
/attendance
/advances
/month-closing
```

must return the React application's:

```text
index.html
```

when directly accessed.

For example, when using Nginx, configure the server to fall back to `index.html` for frontend routes.

---

## Environment Separation

Recommended environments:

```text
Development
    localhost

Staging
    staging.example.com

Production
    app.example.com
```

The API endpoints should be configured separately for each environment.

Example:

```text
Development:
http://localhost:8080

Production:
https://api.example.com
```

Do not commit environment-specific secrets to Git.

---

## Git Workflow

Check the current Git status:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Update frontend"
```

Push to GitHub:

```bash
git push origin main
```

---

## Files That Should Not Be Committed

Make sure the following are ignored:

```text
node_modules/
dist/
.env
.env.*
```

Also avoid committing:

* Private API keys
* Passwords
* Authentication secrets
* Cloud credentials
* Personal access tokens
* Private certificates

---

## Deployment Checklist

Before production deployment:

* [x] React/Vite frontend implementation
* [x] Authentication UI
* [x] Employee management UI
* [x] Attendance UI
* [x] Advances UI
* [x] Hisab/month closing UI
* [ ] Production API configuration
* [ ] Production CORS configuration
* [ ] Production frontend deployment
* [ ] HTTPS integration
* [ ] Domain configuration
* [ ] Production monitoring
* [ ] Deployment documentation

---

## Production Testing Checklist

After deployment, verify:

### Authentication

* [ ] Login works
* [ ] Invalid login is rejected
* [ ] Protected pages cannot be accessed without authentication
* [ ] Expired JWT is handled correctly
* [ ] Logout works correctly

### Employees

* [ ] Employee list loads
* [ ] Employee creation works
* [ ] Employee update works
* [ ] Employee data displays correctly

### Attendance

* [ ] Attendance records load
* [ ] Attendance can be created/updated
* [ ] Attendance calculations are correct

### Advances

* [ ] Advance records load
* [ ] New advances can be created
* [ ] Advance information displays correctly

### Hisab

* [ ] Month closing loads
* [ ] Monthly calculations are correct
* [ ] Settlement information is correct

### General

* [ ] HTTPS works
* [ ] API connection works
* [ ] CORS works correctly
* [ ] Browser refresh works on React routes
* [ ] Mobile/responsive UI works
* [ ] No secrets are exposed in the frontend build

---

## Development Roadmap

* [x] React/Vite frontend implementation
* [x] Authentication UI
* [x] Employee management UI
* [x] Attendance UI
* [x] Advances UI
* [x] Hisab/month closing UI
* [ ] Production API configuration
* [ ] Production CORS configuration
* [ ] Production frontend deployment
* [ ] HTTPS integration
* [ ] Domain configuration
* [ ] Production monitoring
* [ ] Deployment documentation

---

## Related Backend

This frontend is designed to work with the **Sonu Saitring Management System Spring Boot backend**.

The backend uses:

* Java 21
* Spring Boot
* Spring Security
* JWT authentication
* Spring Data JPA
* MySQL

The frontend and backend should be deployed and configured together.

---

## Important Production Notes

Before going live:

1. Replace the localhost backend URL.
2. Configure the production API URL.
3. Configure backend CORS.
4. Enable HTTPS.
5. Configure React SPA fallback.
6. Review JWT storage and authentication security.
7. Make sure no secrets are present in the frontend source.
8. Run the production build.
9. Test every major application module.
10. Monitor the application after deployment.

---

## License

This project is intended for personal/business use.

Add the appropriate license if the project will be distributed publicly.

---

## Author

**Sonu Saitring Management System**

Frontend built with:

* React
* Vite
* Tailwind CSS
* Axios
* React Router
