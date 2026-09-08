import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-800 text-white'
        : 'text-gray-200 hover:bg-blue-700 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? 'bg-blue-800 text-white'
        : 'text-gray-200 hover:bg-blue-700 hover:text-white'
    }`;

  return (
    <nav className="bg-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo / Name */}
          <div className="flex items-center">
            <Link to="/" className="text-white font-medium text-base sm:text-lg tracking-wide flex items-center gap-2">
              <span className="bg-blue-800 text-blue-200 px-2 py-1 rounded text-xs font-semibold">SS</span>
              Sonu Saitring
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2 lg:space-x-4">
              <NavLink to="/" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/employees" className={navLinkClass}>Employees</NavLink>
              <NavLink to="/attendance" className={navLinkClass}>Attendance</NavLink>
              <NavLink to="/advances" className={navLinkClass}>Advances / Hisab</NavLink>
              <NavLink to="/month-closing" className={navLinkClass}>Monthly Hisab</NavLink>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-blue-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-900 border-t border-blue-800" id="mobile-menu">
          <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
          <NavLink to="/employees" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Employees</NavLink>
          <NavLink to="/attendance" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Attendance</NavLink>
          <NavLink to="/advances" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Advances / Hisab</NavLink>
          <NavLink to="/month-closing" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>Monthly Hisab</NavLink>
        </div>
      )}
    </nav>
  );
}