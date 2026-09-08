import React, { useState, useEffect } from 'react';
import EmployeeService from '../../api/employeeService';
import EmployeeFormModal from './EmployeeFormModal';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    fetchEmployees();

    const handleGlobalClick = (event) => {
      if (!event.target.closest('.action-menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
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
      {/* Header section with brand context */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-800 tracking-wide">Sonu Saitring — Employees</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage rates, contact details, and account status.</p>
        </div>
        <button
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-xs font-normal transition-colors cursor-pointer shadow-sm"
        >
          + Add Employee
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-xs">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded text-xs">{success}</div>}

      {/* Responsive Table Wrapper */}
      <div className="bg-white shadow-sm overflow-x-auto sm:rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Initial Rate (₹)</th>
              <th className="px-6 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-[11px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-xs">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                  No records found. Click "Add Employee" to create one.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className={emp.blocked ? 'bg-gray-50/70 text-gray-400' : 'text-gray-700'}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{emp.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{emp.initialRate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 inline-flex text-[10px] font-normal rounded-full ${emp.blocked ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                      {emp.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  
                  {/* Action Menu Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium relative">
                    <div className="inline-block text-left action-menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === emp.id ? null : emp.id);
                        }}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-1 rounded text-[11px] font-normal inline-flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <span>Take Action</span>
                        <svg className="w-3 h-3 ml-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Options Popup */}
                      {activeMenuId === emp.id && (
                        <div className="origin-top-right absolute right-0 mt-1 w-36 rounded shadow-sm bg-white border border-gray-100 ring-1 ring-black/5 z-20 focus:outline-none py-1">
                          <button
                            onClick={() => { setActiveMenuId(null); setEditData(emp); setIsModalOpen(true); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                            role="menuitem"
                          >
                            ✏️ Edit Details
                          </button>
                          <button
                            onClick={() => handleToggleBlock(emp.id)}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center transition-colors ${emp.blocked ? 'text-green-700 hover:bg-green-50' : 'text-amber-700 hover:bg-amber-50'}`}
                            role="menuitem"
                          >
                            {emp.blocked ? '🔓 Unblock' : '🔒 Block'}
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center transition-colors"
                            role="menuitem"
                          >
                            🗑️ Delete
                          </button>
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