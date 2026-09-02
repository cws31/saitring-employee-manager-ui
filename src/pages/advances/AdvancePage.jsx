import React, { useState, useEffect } from 'react';
import EmployeeService from '../../api/employeeService';
import AdvanceService from '../../api/advanceService';

export default function AdvancePage() {
  const [employees, setEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    note: ''
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      const empRes = await EmployeeService.getAllEmployees();
      setEmployees(empRes.data.filter(e => !e.blocked));

      const advRes = await AdvanceService.getMonthlyAdvances(year, month);
      setAdvances(advRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load advance payment records.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.amount) {
      setError('Please select an employee and enter an amount.');
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingId) {
        await AdvanceService.updateAdvance(editingId, payload);
        setSuccess('Advance payment updated successfully!');
      } else {
        await AdvanceService.recordAdvance(payload);
        setSuccess('Advance payment recorded successfully!');
      }

      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to save payment record.');
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      employeeId: item.employee ? item.employee.id : '',
      amount: item.amount,
      paymentDate: item.paymentDate,
      note: item.note || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      employeeId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      note: ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await AdvanceService.deleteAdvance(id);
        setSuccess('Record deleted.');
        loadData();
        setTimeout(() => setSuccess(''), 2500);
      } catch (err) {
        setError('Failed to delete record.');
      }
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const totalAdvances = advances.reduce((sum, item) => sum + item.amount, 0);

  // Group advances date-wise per employee for register cross-verification
  const employeeSummaryMap = advances.reduce((acc, item) => {
    if (!item.employee) return acc;
    const empId = item.employee.id;
    if (!acc[empId]) {
      acc[empId] = {
        name: item.employee.name,
        totalAmount: 0,
        transactions: []
      };
    }
    acc[empId].totalAmount += item.amount;
    acc[empId].transactions.push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advance Payments / Hisab</h1>
          <p className="text-sm text-gray-500">Track mid-month cash or online advances given to employees.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow border">
          <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">&larr;</button>
          <span className="text-lg font-semibold text-gray-800">{monthName}</span>
          <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">&rarr;</button>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">{success}</div>}

      {/* Employee Register Cross-Verification Section */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Register Verification View ({monthName})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => {
            const summary = employeeSummaryMap[emp.id] || { totalAmount: 0, transactions: [] };
            return (
              <div key={emp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
                    <h3 className="font-bold text-gray-900">{emp.name}</h3>
                    <span className="text-sm font-bold text-green-600">Total: ₹{summary.totalAmount.toLocaleString()}</span>
                  </div>

                  {summary.transactions.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">No advances recorded this month.</p>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {summary.transactions.map(tx => (
                        <div key={tx.id} className="bg-white p-2 rounded border border-gray-100 text-xs flex justify-between items-center shadow-sm">
                          <div>
                            <span className="font-semibold text-gray-700">{tx.paymentDate}</span>
                            {tx.note && <p className="text-gray-500 italic truncate max-w-[150px]">{tx.note}</p>}
                          </div>
                          <span className="font-bold text-green-700">₹{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? 'Edit Advance Record' : 'Give Money / Advance'}
            </h2>
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Employee</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., 1000"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Note / Reason (Optional)</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="e.g., Cash given for emergency"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full font-medium py-2 rounded-md transition shadow text-sm text-white ${
                editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {editingId ? 'Update Record' : 'Record Payment'}
            </button>
          </form>
        </div>

        {/* Transaction History Column */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Transaction History</h2>
            <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md text-sm font-semibold">
              Total Advanced: ₹{totalAdvances.toLocaleString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Employee</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase text-xs">Note</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advances.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-sm">
                      No advance payments recorded for {monthName}.
                    </td>
                  </tr>
                ) : (
                  advances.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{item.paymentDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{item.employee ? item.employee.name : 'Unknown'}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-green-600">₹{item.amount}</td>
                      <td className="px-4 py-3 text-gray-500">{item.note || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}