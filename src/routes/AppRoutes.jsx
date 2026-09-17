import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import OwnerDashboard from "../pages/dashboard/OwnerDashboard";
import OwnerProfile from "../pages/owner/OwnerProfile";

import EmployeesPage from "../pages/employees/EmployeesPage";
import AttendancePage from "../pages/attendance/AttendancePage";
import AdvancesPage from "../pages/advances/AdvancesPage";
import MonthClosingPage from "../pages/monthClosing/MonthClosingPage";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";


export default function AppRoutes() {
  return (
    <Routes>


      {/* Landing Page */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* Login Page */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Register Page */}
      <Route
        path="/register"
        element={<RegisterPage />}
      />



      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <OwnerDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Employees */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EmployeesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Attendance */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AttendancePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Advances */}
      <Route
        path="/advances"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdvancesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Month Closing */}
      <Route
        path="/month-closing"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MonthClosingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Owner Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <OwnerProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}
