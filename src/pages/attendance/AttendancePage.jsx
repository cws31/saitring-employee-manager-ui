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
        if (!map[att.employee.id]) map[att.employee.id] = {};
        map[att.employee.id][day] = {
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
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Attendance Register</h1>
          <p className="text-sm text-gray-500">Click any cell to manage status and add optional notes/reasons.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow border">
          <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">&larr;</button>
          <span className="text-lg font-semibold text-gray-800">{monthName}</span>
          <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold">&rarr;</button>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">{success}</div>}

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-max divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left font-bold text-gray-600 uppercase z-10 border-r">Employee</th>
              {daysArray.map(day => (
                <th key={day} className="px-2 py-3 text-center font-medium text-gray-500 w-10 border-r">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={daysInMonth + 1} className="px-6 py-8 text-center text-sm text-gray-400">
                  No active employees found. Please add employees first.
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white px-4 py-3 font-semibold text-gray-900 border-r whitespace-nowrap shadow-sm">
                    {emp.name}
                  </td>
                  {daysArray.map(day => {
                    const entry = attendanceMap[emp.id]?.[day];
                    const status = entry?.status;
                    const reason = entry?.reason;

                    let badgeColor = 'bg-gray-100 text-gray-400 hover:bg-gray-200';
                    let label = '-';

                    if (status === 'PRESENT') {
                      badgeColor = 'bg-green-600 text-white font-bold';
                      label = 'P';
                    } else if (status === 'ABSENT') {
                      badgeColor = 'bg-red-600 text-white font-bold';
                      label = 'A';
                    } else if (status === 'HALF_DAY') {
                      badgeColor = 'bg-yellow-500 text-white font-bold';
                      label = 'H';
                    }

                    return (
                      <td key={day} className="px-1 py-2 text-center border-r relative">
                        <button
                          onClick={() => handleOpenModal(emp, day)}
                          className={`w-8 h-8 mx-auto flex items-center justify-center rounded text-xs transition relative ${badgeColor}`}
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

      <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600 bg-white p-3 rounded-lg shadow-sm border inline-flex">
        <div className="flex items-center space-x-2"><span className="w-4 h-4 bg-green-600 rounded inline-block"></span><span><strong>P</strong> = Present</span></div>
        <div className="flex items-center space-x-2"><span className="w-4 h-4 bg-red-600 rounded inline-block"></span><span><strong>A</strong> = Absent</span></div>
        <div className="flex items-center space-x-2"><span className="w-4 h-4 bg-yellow-500 rounded inline-block"></span><span><strong>H</strong> = Half Day</span></div>
        <div className="flex items-center space-x-2"><span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span><span>Blue dot indicates note/reason added</span></div>
      </div>

      {/* Modal for Marking Attendance & Adding Reason */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Mark Attendance
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {modalData.employee.name} — Day {modalData.day} of {monthName}
            </p>

            <form onSubmit={handleSaveAttendance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`flex items-center justify-center p-2.5 rounded-md border cursor-pointer text-xs font-semibold transition ${modalData.status === 'PRESENT' ? 'bg-green-50 border-green-600 text-green-700 shadow-sm ring-1 ring-green-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="PRESENT"
                      checked={modalData.status === 'PRESENT'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      className="sr-only"
                    />
                    🟢 Present (P)
                  </label>

                  <label className={`flex items-center justify-center p-2.5 rounded-md border cursor-pointer text-xs font-semibold transition ${modalData.status === 'ABSENT' ? 'bg-red-50 border-red-600 text-red-700 shadow-sm ring-1 ring-red-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="ABSENT"
                      checked={modalData.status === 'ABSENT'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      className="sr-only"
                    />
                    🔴 Absent (A)
                  </label>

                  <label className={`flex items-center justify-center p-2.5 rounded-md border cursor-pointer text-xs font-semibold transition ${modalData.status === 'HALF_DAY' ? 'bg-yellow-50 border-yellow-600 text-yellow-800 shadow-sm ring-1 ring-yellow-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="attendanceStatus"
                      value="HALF_DAY"
                      checked={modalData.status === 'HALF_DAY'}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      className="sr-only"
                    />
                    🟡 Half Day (H)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Reason / Note <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={modalData.reason}
                  onChange={(e) => setModalData({ ...modalData, reason: e.target.value })}
                  placeholder="e.g., Medical leave, Client visit..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  maxLength={250}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition shadow"
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