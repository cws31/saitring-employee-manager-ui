import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import AttendancePage from './pages/attendance/AttendancePage';
import AdvancePage from './pages/advances/AdvancePage';
import HisabPage from './pages/Hisab/HisabPage';
import LoginPage from './pages/LoginPage';

import ProtectedRoute from './components/ProtectedRoute';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">

      {!isLoginPage && <Navbar />}

      <main>
        <Routes>

     

          <Route path="/login" element={<LoginPage />} />



          <Route element={<ProtectedRoute />}>

            <Route path="/" element={<Dashboard />} />

            <Route
              path="/employees"
              element={<EmployeeList />}
            />

            <Route
              path="/attendance"
              element={<AttendancePage />}
            />

            <Route
              path="/advances"
              element={<AdvancePage />}
            />

            <Route
              path="/month-closing"
              element={<HisabPage />}
            />

          </Route>


         
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

    </div>
  );
};


function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;