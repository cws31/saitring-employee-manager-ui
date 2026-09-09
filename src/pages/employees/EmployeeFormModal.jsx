import React, { useState, useEffect } from 'react';

export default function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
  errors = {},
  clearFieldError
}) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    initialRate: ''
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        mobile: editData.mobile,
        initialRate: editData.initialRate
      });
    } else {
      setFormData({
        name: '',
        mobile: '',
        initialRate: ''
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));

    if (errors[field] && clearFieldError) {
      clearFieldError(field);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      initialRate:
        formData.initialRate === ''
          ? 0
          : parseFloat(formData.initialRate)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
          <h3 className="text-base font-medium text-gray-800">
            {editData ? 'Edit Employee Details' : 'Add New Employee'}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-normal text-gray-600 mb-1">
              Full Name
            </label>

            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none transition-colors ${
                errors.name
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-600'
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-normal text-gray-600 mb-1">
              Mobile Number
            </label>

            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              placeholder="10-digit mobile number"
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none transition-colors ${
                errors.mobile
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-600'
              }`}
            />

            {errors.mobile && (
              <p className="mt-1 text-xs text-red-600">
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Initial Rate */}
          <div>
            <label className="block text-xs font-normal text-gray-600 mb-1">
              Initial Rate (₹)
            </label>

            <input
              type="number"
              step="0.01"
              value={formData.initialRate}
              onChange={(e) =>
                handleChange('initialRate', e.target.value)
              }
              placeholder="Default is 0"
              className={`w-full px-3 py-2 border rounded text-sm focus:outline-none transition-colors ${
                errors.initialRate
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-600'
              }`}
            />

            {errors.initialRate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.initialRate}
              </p>
            )}
          </div>

          {/* Buttons */}
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