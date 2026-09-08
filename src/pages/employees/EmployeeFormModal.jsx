import React, { useState, useEffect } from 'react';

export default function EmployeeFormModal({ isOpen, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState({ name: '', mobile: '', initialRate: '' });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        mobile: editData.mobile,
        initialRate: editData.initialRate
      });
    } else {
      setFormData({ name: '', mobile: '', initialRate: '' });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      initialRate: formData.initialRate === '' ? 0 : parseFloat(formData.initialRate)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full max-w-md p-6">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-base font-medium text-gray-800">
            {editData ? 'Edit Employee Details' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-normal text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rajesh Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-gray-600 mb-1">Mobile Number</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-gray-600 mb-1">Initial Rate (₹)</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
              value={formData.initialRate}
              onChange={(e) => setFormData({ ...formData, initialRate: e.target.value })}
              placeholder="Default is 0"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-xs font-normal text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-normal transition-colors cursor-pointer"
            >
              {editData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}