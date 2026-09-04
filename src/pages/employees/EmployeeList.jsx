import React, { useState, useEffect, useRef } from 'react';
import EmployeeService from '../../api/employeeService';
import EmployeeFormModal from './EmployeeFormModal';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchEmployees();

  
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await EmployeeService.getAllEmployees();
      setEmployees(res.data);
      setError('');
    } catch (err) {
      setError('Could not connect to backend server.');
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      if (editData) {
        await EmployeeService.updateEmployee(editData.id, formData);
        setSuccess('Employee updated successfully.');
      } else {
        await EmployeeService.addEmployee(formData);
        setSuccess('Employee added successfully.');
      }
      setIsModalOpen(false);
      setEditData(null);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    setActiveMenuId(null);
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await EmployeeService.deleteEmployee(id);
        setSuccess('Employee deleted.');
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee.');
      }
    }
  };

  const handleToggleBlock = async (id) => {
    setActiveMenuId(null);
    try {
      await EmployeeService.toggleBlockStatus(id);
      fetchEmployees();
    } catch (err) {
      setError('Failed to change block status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-sm text-gray-500">Manage rates, contact information, and account status securely.</p>
        </div>
        <button
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow text-sm font-medium hover:bg-blue-700 transition"
        >
          + Add Employee
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">{success}</div>}

      <div className="bg-white shadow overflow-visible sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Rate (₹)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-400">
                  No records found. Click "Add Employee" to create one.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className={emp.blocked ? 'bg-gray-50 text-gray-400' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">₹{emp.initialRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {emp.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  
                  {/* Hidden Action Menu Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <div className="inline-block text-left" ref={menuRef}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <span>Take Action</span>
                        <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Options Popup */}
                      {activeMenuId === emp.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 focus:outline-none">
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => { setActiveMenuId(null); setEditData(emp); setIsModalOpen(true); }}
                              className="w-full text-left px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 flex items-center"
                              role="menuitem"
                            >
                              ✏️ Edit Details
                            </button>
                            <button
                              onClick={() => handleToggleBlock(emp.id)}
                              className={`w-full text-left px-4 py-2 text-xs flex items-center ${emp.blocked ? 'text-green-700 hover:bg-green-50' : 'text-amber-700 hover:bg-amber-50'}`}
                              role="menuitem"
                            >
                              {emp.blocked ? '🔓 Unblock' : '🔒 Block'}
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center"
                              role="menuitem"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveEmployee}
        editData={editData}
      />
    </div>
  );
}