// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import AttendancePage from './pages/attendance/AttendancePage';
import AdvancePage from './pages/advances/AdvancePage';
import HisabPage from './pages/hisab/HisabPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/advances" element={<AdvancePage />} />
            <Route path="/month-closing" element={<HisabPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;