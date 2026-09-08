import React, { useState, useEffect } from 'react';
import EmployeeService from '../../api/employeeService';
import AttendanceService from '../../api/attendanceService';

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalData, setModalData] = useState(null); 

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; 

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    loadData();
  }, [currentDate]);

const loadData = async () => {
    try {
      const empRes = await EmployeeService.getAllEmployees();
      const activeEmps = empRes.data.filter(e => !e.blocked);
      setEmployees(activeEmps);

      const attRes = await AttendanceService.getMonthlyAttendance(year, month);
      
      const map = {};
      attRes.data.forEach(att => {
        const day = new Date(att.attendanceDate).getDate();
        if (!map[att.employeeId]) map[att.employeeId] = {};
        map[att.employeeId][day] = {
          status: att.status,
          reason: att.reason || ''
        };
      });
      setAttendanceMap(map);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance records.');
    }
  };

  const handleOpenModal = (employee, day) => {
    const existingEntry = attendanceMap[employee.id]?.[day] || { status: 'PRESENT', reason: '' };
    setModalData({
      employee,
      day,
      status: existingEntry.status || 'PRESENT',
      reason: existingEntry.reason || ''
    });
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!modalData) return;

    const { employee, day, status, reason } = modalData;
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const attendanceDate = `${year}-${formattedMonth}-${formattedDay}`;

    try {
      await AttendanceService.markAttendance({
        employeeId: employee.id,
        attendanceDate,
        status,
        reason
      });

      setAttendanceMap(prev => ({
        ...prev,
        [employee.id]: {
          ...(prev[employee.id] || {}),
          [day]: { status, reason }
        }
      }));

      setSuccess(`Attendance updated for ${employee.name} (Day ${day})`);
      setModalData(null);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to update attendance.');
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-800 tracking-wide">Monthly Attendance Register</h1>
          <p className="text-xs text-gray-500 mt-0.5">Click any cell to manage status and add optional notes/reasons.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded shadow-sm border border-gray-100">
          <button onClick={handlePrevMonth} className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded text-xs transition-colors cursor-pointer">&larr;</button>
          <span className="text-sm font-medium text-gray-800 min-w-[130px] text-center">{monthName}</span>
          <button onClick={handleNextMonth} className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded text-xs transition-colors cursor-pointer">&rarr;</button>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-xs">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded text-xs">{success}</div>}

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-x-auto">
        <table className="min-w-max divide-y divide-gray-100 text-xs">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="sticky left-0 bg-gray-50/90 px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider z-10 border-r border-gray-100">Employee</th>
              {daysArray.map(day => (
                <th key={day} className="px-2 py-3 text-center font-normal text-gray-400 w-9 border-r border-gray-100">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 1} className="px-6 py-8 text-center text-xs text-gray-400">
                  No active employees found. Please add employees first.
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="sticky left-0 bg-white px-4 py-3 font-medium text-gray-800 border-r border-gray-100 whitespace-nowrap shadow-sm">
                    {emp.name}
                  </td>
                  {daysArray.map(day => {
                    const entry = attendanceMap[emp.id]?.[day];
                    const status = entry?.status;
                    const reason = entry?.reason;

                    let badgeColor = 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200';
                    let label = '-';

                    if (status === 'PRESENT') {
                      badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium';
                      label = 'P';
                    } else if (status === 'ABSENT') {
                      badgeColor = 'bg-rose-50 text-rose-700 border border-rose-200 font-medium';
                      label = 'A';
                    } else if (status === 'HALF_DAY') {
                      badgeColor = 'bg-amber-50 text-amber-700 border border-amber-200 font-medium';
                      label = 'H';
                    }

                    return (
                      <td key={day} className="px-1 py-2 text-center border-r border-gray-100 relative">
                        <button
                          onClick={() => handleOpenModal(emp, day)}
                          className={`w-7 h-7 mx-auto flex items-center justify-center rounded text-[11px] transition cursor-pointer relative ${badgeColor}`}
                          title={reason ? `Reason: ${reason}` : 'Click to add status/reason'}
                        >
                          {label}
                          {reason && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full ring-1 ring-white" title="Has reason note" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded inline-block"></span><span><strong>P</strong> = Present</span></div>
        <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-rose-100 border border-rose-200 rounded inline-block"></span><span><strong>A</strong> = Absent</span></div>
        <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded inline-block"></span><span><strong>H</strong> = Half Day</span></div>
        <div className="flex items-center space-x-1.5"><span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span><span>Blue dot indicates note added</span></div>
      </div>

      {/* Modal for Marking Attendance & Adding Reason */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">Mark Attendance</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {modalData.employee.name} — Day {modalData.day} of {monthName}
                </p>
              </div>
              <button onClick={() => setModalData(null)} className="text-gray-400 hover:text-gray-600 text-xl font-light">&times;</button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-4">
              <div>
                <label className="block text-xs font-normal text-gray-600 mb-2">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`flex items-center justify-center p-2 rounded border cursor-pointer text-xs font-normal transition ${modalData.status === 'PRESENT' ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="PRESENT"
                      checked={modalData.status === 'PRESENT'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      className="sr-only"
                    />
                    Present (P)
                  </label>

                  <label className={`flex items-center justify-center p-2 rounded border cursor-pointer text-xs font-normal transition ${modalData.status === 'ABSENT' ? 'bg-rose-50 border-rose-600 text-rose-700 shadow-sm' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="ABSENT"
                      checked={modalData.status === 'ABSENT'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      className="sr-only"
                    />
                    Absent (A)
                  </label>

                  <label className={`flex items-center justify-center p-2 rounded border cursor-pointer text-xs font-normal transition ${modalData.status === 'HALF_DAY' ? 'bg-amber-50 border-amber-600 text-amber-800 shadow-sm' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="HALF_DAY"
                      checked={modalData.status === 'HALF_DAY'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      className="sr-only"
                    />
                    Half Day (H)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-gray-600 mb-1">
                  Reason / Note <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={modalData.reason}
                  onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
                  placeholder="e.g., Medical leave, Client visit..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                  maxLength={250}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-normal text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-normal transition-colors cursor-pointer shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}