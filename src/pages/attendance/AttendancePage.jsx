import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import attendanceApi from "../../api/attendanceApi";
import employeeApi from "../../api/employeeApi";
import AttendanceSummary from "../../components/AttendanceSummary";

const STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  HALF_DAY: "HALF_DAY",
  LEAVE: "LEAVE",
};

const STATUS_LABEL = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half Day",
  LEAVE: "Leave",
};

const STATUS_STYLE = {
  PRESENT: "bg-green-100 text-green-700 border-green-200",
  ABSENT: "bg-red-100 text-red-700 border-red-200",
  HALF_DAY: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LEAVE: "bg-blue-100 text-blue-700 border-blue-200",
};

const getTodayDateString = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const formatDate = (year, month, day) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

const formatMonthYear = (year, month) => {
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const AttendancePage = () => {
  const today = new Date();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dailySummary, setDailySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summaryDate, setSummaryDate] = useState(getTodayDateString());

  const [summaryOpen, setSummaryOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCell, setSelectedCell] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    date: "",
    status: STATUS.PRESENT,
  });

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkDate, setBulkDate] = useState(getTodayDateString());
  const [bulkStatus, setBulkStatus] = useState(STATUS.PRESENT);

  const daysInMonth = useMemo(
    () => getDaysInMonth(year, month),
    [year, month]
  );

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
    [daysInMonth]
  );

  const loadEmployees = async () => {
    try {
      const response = await employeeApi.getAllEmployees();

      const data = response?.data ?? response ?? [];

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError("Failed to load employees.");
    }
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await attendanceApi.getMonthlyAttendance(year, month);

      const data = response?.data ?? response ?? [];

      const attendanceMap = {};

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const employeeId =
            item.employeeId ??
            item.employee?.id ??
            item.employee?.employeeId;

          const date =
            item.date ??
            item.attendanceDate ??
            item.attendance?.date;

          const status = item.status;

          if (employeeId && date) {
            if (!attendanceMap[employeeId]) {
              attendanceMap[employeeId] = {};
            }

            attendanceMap[employeeId][date] = status;
          }
        });
      }

      setAttendance(attendanceMap);
    } catch (err) {
      console.error("Failed to load attendance:", err);
      setError("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      setSummaryLoading(true);
      setSummaryError("");

      const [monthlyResponse, dailyResponse] = await Promise.all([
        attendanceApi.getMonthlySummary(year, month),
        attendanceApi.getDailySummary(summaryDate),
      ]);

      const monthlyData =
        monthlyResponse?.data ?? monthlyResponse ?? [];

      const dailyData =
        dailyResponse?.data ?? dailyResponse ?? null;

      setMonthlySummary(
        Array.isArray(monthlyData) ? monthlyData : []
      );

      setDailySummary(dailyData);
    } catch (err) {
      console.error("Failed to load attendance summary:", err);
      setSummaryError("Failed to load attendance summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadAttendance(), loadSummary()]);
    };

    loadData();
  }, [year, month, summaryDate]);

  const handleDateSelectionChange = (date) => {
    setSummaryDate(date);

    if (!date) {
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return;
    }

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth() + 1;

    if (selectedYear !== year || selectedMonth !== month) {
      setYear(selectedYear);
      setMonth(selectedMonth);
    }
  };

  const handleSummaryRetry = () => {
    loadSummary();
  };

  const attendanceKey = (employeeId, day) => {
    return formatDate(year, month, day);
  };

  const getAttendanceStatus = (employeeId, day) => {
    const date = attendanceKey(employeeId, day);

    return attendance?.[employeeId]?.[date] || null;
  };

  const handleCellClick = (employee, day) => {
    const date = attendanceKey(employee.id, day);

    const currentStatus =
      attendance?.[employee.id]?.[date] || STATUS.PRESENT;

    setSelectedCell({
      employee,
      day,
      date,
    });

    setForm({
      employeeId: employee.id,
      date,
      status: currentStatus,
    });
  };

  const closeAttendanceModal = () => {
    if (saving) {
      return;
    }

    setSelectedCell(null);

    setForm({
      employeeId: "",
      date: "",
      status: STATUS.PRESENT,
    });
  };

  const handleSaveAttendance = async (event) => {
    event.preventDefault();

    if (!form.employeeId || !form.date || !form.status) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await attendanceApi.markAttendance({
        employeeId: form.employeeId,
        date: form.date,
        status: form.status,
      });

      setSuccess("Attendance updated successfully.");

      closeAttendanceModal();

      await Promise.all([loadAttendance(), loadSummary()]);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      setError("Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAttendance = async (event) => {
    event.preventDefault();

    if (!bulkDate || !bulkStatus) {
      return;
    }

    try {
      setBulkSaving(true);
      setError("");
      setSuccess("");

      const requests = employees.map((employee) =>
        attendanceApi.markAttendance({
          employeeId: employee.id,
          date: bulkDate,
          status: bulkStatus,
        })
      );

      await Promise.all(requests);

      setSuccess("Attendance updated for all employees.");

      setBulkModalOpen(false);

      await Promise.all([loadAttendance(), loadSummary()]);
    } catch (err) {
      console.error("Failed to update bulk attendance:", err);
      setError("Failed to update attendance for all employees.");
    } finally {
      setBulkSaving(false);
    }
  };

  const handlePreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((currentYear) => currentYear - 1);
    } else {
      setMonth((currentMonth) => currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((currentYear) => currentYear + 1);
    } else {
      setMonth((currentMonth) => currentMonth + 1);
    }
  };

  const handleCurrentMonth = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
  };

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) => {
      const name = String(
        employee.name ??
          employee.fullName ??
          employee.employeeName ??
          ""
      ).toLowerCase();

      const employeeCode = String(
        employee.employeeCode ??
          employee.code ??
          employee.empCode ??
          ""
      ).toLowerCase();

      return name.includes(query) || employeeCode.includes(query);
    });
  }, [employees, searchQuery]);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Attendance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage employee attendance and monthly records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setBulkModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Mark Bulk Attendance
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setSummaryOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-gray-50 sm:px-5"
          aria-expanded={summaryOpen}
        >
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">
              Attendance Summary
            </h2>

            <p className="mt-0.5 text-[11px] leading-4 text-gray-500 sm:text-xs">
              View daily attendance and monthly reports.
            </p>
          </div>

          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition-transform ${
              summaryOpen ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </button>

        {summaryOpen && (
          <div className="border-t border-gray-200">
            <AttendanceSummary
              dailySummary={dailySummary}
              monthlySummary={monthlySummary}
              monthlyTotals={monthlySummary}
              loading={summaryLoading}
              error={summaryError}
              monthName={formatMonthYear(year, month)}
              year={year}
              summaryDate={summaryDate}
              onRetry={handleSummaryRetry}
              onDateChange={handleDateSelectionChange}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="min-w-[170px] text-center">
              <h2 className="text-base font-bold text-gray-900">
                {formatMonthYear(year, month)}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>

            <button
              type="button"
              onClick={handleCurrentMonth}
              className="ml-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Current
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search employee..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-gray-200 px-4 py-3 sm:px-5">
          {Object.entries(STATUS_LABEL).map(([status, label]) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full border ${STATUS_STYLE[status]}`}
              />

              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>

        <div className="relative overflow-x-auto">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                Loading attendance...
              </div>
            </div>
          )}

          <table className="min-w-max w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 z-20 min-w-[190px] border-b border-r border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-700">
                  Employee
                </th>

                {days.map((day) => {
                  const date = new Date(
                    `${formatDate(year, month, day)}T00:00:00`
                  );

                  const weekday = date.toLocaleDateString("en-IN", {
                    weekday: "short",
                  });

                  return (
                    <th
                      key={day}
                      className="min-w-[48px] border-b border-gray-200 px-2 py-3 text-center"
                    >
                      <div className="text-xs font-bold text-gray-700">
                        {day}
                      </div>

                      <div className="mt-0.5 text-[10px] text-gray-400">
                        {weekday}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={days.length + 1}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="sticky left-0 z-10 border-r border-gray-200 bg-white px-4 py-3">
                      <div className="min-w-[150px]">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          {employee.name ??
                            employee.fullName ??
                            employee.employeeName ??
                            "Unnamed Employee"}
                        </div>

                        {(employee.employeeCode ||
                          employee.code ||
                          employee.empCode) && (
                          <div className="mt-0.5 text-[11px] text-gray-400">
                            {employee.employeeCode ??
                              employee.code ??
                              employee.empCode}
                          </div>
                        )}
                      </div>
                    </td>

                    {days.map((day) => {
                      const status = getAttendanceStatus(
                        employee.id,
                        day
                      );

                      return (
                        <td
                          key={day}
                          className="border-r border-gray-100 px-1 py-2 text-center last:border-r-0"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleCellClick(employee, day)
                            }
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-bold transition ${
                              status
                                ? STATUS_STYLE[status]
                                : "border-gray-200 bg-gray-50 text-gray-300 hover:bg-gray-100"
                            }`}
                            title={
                              status
                                ? STATUS_LABEL[status]
                                : "Not marked"
                            }
                          >
                            {status
                              ? status === STATUS.HALF_DAY
                                ? "H"
                                : status.charAt(0)
                              : "—"}
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
      </div>

      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Mark Attendance
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  {selectedCell.employee.name ??
                    selectedCell.employee.fullName ??
                    selectedCell.employee.employeeName ??
                    "Employee"}{" "}
                  · {selectedCell.date}
                </p>
              </div>

              <button
                type="button"
                onClick={closeAttendanceModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSaveAttendance}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                >
                  {Object.entries(STATUS_LABEL).map(
                    ([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAttendanceModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Bulk Attendance
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Mark the same status for all employees.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleBulkAttendance}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    value={bulkDate}
                    onChange={(event) =>
                      setBulkDate(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Status
                </label>

                <select
                  value={bulkStatus}
                  onChange={(event) =>
                    setBulkStatus(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                >
                  {Object.entries(STATUS_LABEL).map(
                    ([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(false)}
                  disabled={bulkSaving}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bulkSaving}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bulkSaving ? "Saving..." : "Mark Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
