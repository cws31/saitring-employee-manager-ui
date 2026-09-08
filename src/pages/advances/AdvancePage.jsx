import React, { useState, useEffect } from 'react';
import EmployeeService from '../../api/employeeService';
import AdvanceService from '../../api/advanceService';

export default function AdvancePage() {
  const [employees, setEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [inlineInputs, setInlineInputs] = useState({});

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

  const handleInlineSubmit = async (empId) => {
    const inputData = inlineInputs[empId];
    if (!inputData || !inputData.amount) {
      setError('Please enter an amount.');
      return;
    }

    try {
      const payload = {
        employeeId: empId,
        amount: parseFloat(inputData.amount),
        paymentDate: inputData.paymentDate || new Date().toISOString().split('T')[0],
        note: inputData.note || ''
      };

      if (inputData.editingId) {
        await AdvanceService.updateAdvance(inputData.editingId, payload);
        setSuccess('Advance payment updated successfully!');
      } else {
        await AdvanceService.recordAdvance(payload);
        setSuccess('Advance payment recorded successfully!');
      }

      // Clear inline form state for this specific employee
      setInlineInputs(prev => ({
        ...prev,
        [empId]: { amount: '', paymentDate: new Date().toISOString().split('T')[0], note: '', editingId: null, showForm: false }
      }));

      loadData();
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to save payment record.');
    }
  };

  const handleInlineEditClick = (empId, tx) => {
    setInlineInputs(prev => ({
      ...prev,
      [empId]: {
        amount: tx.amount,
        paymentDate: tx.paymentDate,
        note: tx.note || '',
        editingId: tx.id,
        showForm: true
      }
    }));
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

  
  const totalAdvances = advances
    .filter(item => !item.note || !item.note.toLowerCase().includes('carry-forward'))
    .reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (amt) => {
    if (amt < 0) {
      return `-₹${Math.abs(amt).toLocaleString()}`;
    } else if (amt > 0) {
      return `+₹${amt.toLocaleString()}`;
    }
    return `₹0`;
  };

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
    acc[empId].transactions.push(item);
    return acc;
  }, {});

  Object.keys(employeeSummaryMap).forEach(empId => {
    const summary = employeeSummaryMap[empId];
    const carryForwardTx = summary.transactions.find(tx => 
      tx.note && tx.note.toLowerCase().includes('carry-forward')
    );
    
    const prevBalance = carryForwardTx ? carryForwardTx.amount : 0;
    const currentMonthAdvances = summary.transactions
      .filter(tx => !tx.note || !tx.note.toLowerCase().includes('carry-forward'))
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (prevBalance < 0) {
      summary.totalAmount = prevBalance - currentMonthAdvances;
    } else if (prevBalance > 0) {
      summary.totalAmount = prevBalance - currentMonthAdvances;
    } else {
      summary.totalAmount = currentMonthAdvances;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advance Payments / Hisab</h1>
          <p className="text-sm text-gray-500">Track mid-month cash or online advances given to employees.</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Total Advanced Display on Top */}
          <div className="bg-blue-50 text-blue-800 border border-blue-200 px-4 py-2 rounded-lg shadow-sm text-sm font-semibold">
            Total Advanced ({monthName}): <span className="text-blue-700 font-bold">{formatCurrency(totalAdvances)}</span>
          </div>

          <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow border">
            <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">&larr;</button>
            <span className="text-lg font-semibold text-gray-800">{monthName}</span>
            <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">&rarr;</button>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">{success}</div>}

      {/* Employee Cards with Integrated History and Inline Controls */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Employee Advances & History ({monthName})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(emp => {
            const summary = employeeSummaryMap[emp.id] || { totalAmount: 0, transactions: [] };
            const empInput = inlineInputs[emp.id] || { 
              amount: '', 
              paymentDate: new Date().toISOString().split('T')[0], 
              note: '', 
              editingId: null, 
              showForm: false 
            };
            
            const totalSummaryColor = summary.totalAmount < 0 
              ? 'text-red-600' 
              : summary.totalAmount > 0 
                ? 'text-green-600' 
                : 'text-blue-600';

            return (
              <div key={emp.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
                    <h3 className="font-bold text-gray-900">{emp.name}</h3>
                    <span className={`text-sm font-bold ${totalSummaryColor}`}>
                      Total: {formatCurrency(summary.totalAmount)}
                    </span>
                  </div>

                  {summary.transactions.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">No advances recorded this month.</p>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {summary.transactions.map(tx => {
                        const isCarryForward = tx.note && tx.note.toLowerCase().includes('carry-forward');
                        const isDue = isCarryForward && tx.note.toLowerCase().includes('due');

                        const isRed = (isDue || tx.amount < 0);
                        const badgeColorClass = isRed 
                          ? 'text-red-700 bg-red-50 border-red-200' 
                          : 'text-green-700 bg-green-50 border-green-200';

                        return (
                          <div key={tx.id} className={`p-2 rounded border text-xs flex justify-between items-center shadow-sm ${badgeColorClass}`}>
                            <div className="overflow-hidden mr-2">
                              <span className="font-semibold text-gray-700">{tx.paymentDate}</span>
                              {tx.note && <p className="text-gray-500 italic truncate max-w-[120px]">{tx.note}</p>}
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className={`font-bold ${isRed ? 'text-red-600' : 'text-green-700'}`}>
                                {formatCurrency(tx.amount)}
                              </span>
                              {!isCarryForward && (
                                <div className="flex items-center space-x-1 border-l pl-2 border-gray-300">
                                  <button
                                    onClick={() => handleInlineEditClick(emp.id, tx)}
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                    title="Edit amount"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(tx.id)}
                                    className="text-red-600 hover:text-red-800 font-semibold"
                                    title="Delete record"
                                  >
                                    Del
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Inline Action Toggle & Form */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {!empInput.showForm ? (
                    <button
                      onClick={() => setInlineInputs(prev => ({
                        ...prev,
                        [emp.id]: { ...empInput, showForm: true, editingId: null, amount: '', note: '' }
                      }))}
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium py-1.5 px-3 rounded text-xs transition border border-blue-200"
                    >
                      + Add Advance for {emp.name.split(' ')[0]}
                    </button>
                  ) : (
                    <div className="bg-white p-3 rounded border border-blue-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center font-semibold text-gray-700">
                        <span>{empInput.editingId ? 'Edit Advance' : 'New Advance'}</span>
                        <button
                          onClick={() => setInlineInputs(prev => ({
                            ...prev,
                            [emp.id]: { ...empInput, showForm: false, editingId: null }
                          }))}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Amount (₹)"
                          value={empInput.amount}
                          onChange={(e) => setInlineInputs(prev => ({
                            ...prev,
                            [emp.id]: { ...empInput, amount: e.target.value }
                          }))}
                          className="w-full border rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={empInput.paymentDate}
                          onChange={(e) => setInlineInputs(prev => ({
                            ...prev,
                            [emp.id]: { ...empInput, paymentDate: e.target.value }
                          }))}
                          className="w-full border rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Note (optional)"
                          value={empInput.note}
                          onChange={(e) => setInlineInputs(prev => ({
                            ...prev,
                            [emp.id]: { ...empInput, note: e.target.value }
                          }))}
                          className="w-full border rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => handleInlineSubmit(emp.id)}
                        className={`w-full py-1.5 rounded font-medium text-white transition ${
                          empInput.editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {empInput.editingId ? 'Update' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}