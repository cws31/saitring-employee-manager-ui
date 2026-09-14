import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OwnerDashboard from "../pages/dashboard/OwnerDashboard";
import EmployeesPage from "../pages/employees/EmployeesPage";
import AttendancePage from "../pages/attendance/AttendancePage";
import AdvancesPage from "../pages/advances/AdvancesPage";
import MonthClosingPage from "../pages/monthClosing/MonthClosingPage";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Main / Default Page */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
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

    </Routes>
  );
}