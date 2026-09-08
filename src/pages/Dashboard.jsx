import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section updated with Sonu Saitring branding and normal font weights */}
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-gray-800 tracking-wide">Sonu Saitring Dashboard</h1>
        <p className="mt-1 text-xs text-gray-500">Overview of business modules and quick operational actions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Employee Module Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-50 text-blue-600 rounded-md p-3 text-lg">
                👥
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-xs font-normal text-gray-500 truncate">Employee Management</dt>
                <dd className="text-base font-medium text-gray-800">Directory & Rates</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100">
            <div className="text-xs">
              <Link to="/employees" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Manage Employees &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Attendance Module Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-50 text-green-600 rounded-md p-3 text-lg">
                📅
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-xs font-normal text-gray-500 truncate">Attendance Module</dt>
                <dd className="text-base font-medium text-gray-800">Daily Tracking</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100">
            <div className="text-xs">
              <Link to="/attendance" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Mark Attendance &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Advances / Hisab Module Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-50 text-amber-600 rounded-md p-3 text-lg">
                💸
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-xs font-normal text-gray-500 truncate">Advances</dt>
                <dd className="text-base font-medium text-gray-800">Cash Advances</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100">
            <div className="text-xs">
              <Link to="/advances" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Manage Advances &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Hisab Module Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-md p-3 text-lg">
                💰
              </div>
              <div className="ml-4 w-0 flex-1">
                <dt className="text-xs font-normal text-gray-500 truncate">Monthly Hisab</dt>
                <dd className="text-base font-medium text-gray-800">Closing & Reports</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100">
            <div className="text-xs">
              <Link to="/month-closing" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View Closing Reports &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}