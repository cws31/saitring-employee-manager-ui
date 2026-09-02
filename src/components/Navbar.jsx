// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-800 text-white'
        : 'text-gray-200 hover:bg-blue-700 hover:text-white'
    }`;

  return (
    <nav className="bg-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-lg tracking-wide">
              🏢 Business Manager
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/employees" className={navLinkClass}>
                Employees
              </NavLink>
              <NavLink to="/attendance" className={navLinkClass}>
                Attendance
              </NavLink>
              <NavLink to="/advances" className={navLinkClass}>
                Advances / Hisab
              </NavLink>
              <NavLink to="/month-closing" className={navLinkClass}>
                Monthly Hisab
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}