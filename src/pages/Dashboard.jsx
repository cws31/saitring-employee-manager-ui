
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Father's Business Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of business modules and quick actions.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Employee Module Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3 text-white text-xl">
                👥
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Employee Management</dt>
                <dd className="text-lg font-semibold text-gray-900">Directory & Rates</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/employees" className="font-medium text-blue-600 hover:text-blue-500">
                Manage Employees &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Attendance Module Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3 text-white text-xl">
                📅
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Attendance Module</dt>
                <dd className="text-lg font-semibold text-gray-900">Daily Tracking</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/attendance" className="font-medium text-blue-600 hover:text-blue-500">
                Mark Attendance &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Advances / Hisab Module Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-500 rounded-md p-3 text-white text-xl">
                💸
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Advances</dt>
                <dd className="text-lg font-semibold text-gray-900">Cash Advances</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/advances" className="font-medium text-blue-600 hover:text-blue-500">
                Manage Advances &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Monthly Hisab Module Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-600 rounded-md p-3 text-white text-xl">
                💰
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Hisab</dt>
                <dd className="text-lg font-semibold text-gray-900">Closing & Reports</dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/month-closing" className="font-medium text-blue-600 hover:text-blue-500">
                View Closing Reports &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}