import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  FileText,
  Search,
  X,
  RotateCcw,
} from "lucide-react";

import attendanceApi from "../../api/attendanceApi";
import employeeApi from "../../api/employeeApi";

const STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  HALF_DAY: "HALF_DAY",
};

const STATUS_LABEL = {
  PRESENT: "Present",
  ABSENT: "Absent",
  HALF_DAY: "Half Day",
};

const STATUS_STYLE = {
  PRESENT: "bg-green-100 text-green-700 border-green-200",
  ABSENT: "bg-red-100 text-red-700 border-red-200",
  HALF_DAY: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const formatDate = (year, month, day) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);

  const [form, setForm] = useState({
    status: STATUS.PRESENT,
    reason: "",
  });

  const days = useMemo(() => {
    return Array.from(
      { length: getDaysInMonth(year, month) },
      (_, index) => index + 1
    );
  }, [year, month]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeesResponse, attendanceResponse] = await Promise.all([
        employeeApi.getAll(),
        attendanceApi.getMonthly(year, month),
      ]);

      setEmployees(
        Array.isArray(employeesResponse) ? employeesResponse : []
      );

      setAttendance(
        Array.isArray(attendanceResponse) ? attendanceResponse : []
      );
    } catch (err) {
      console.error("Failed to load attendance data:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [year, month]);

  const attendanceMap = useMemo(() => {
    const map = new Map();

    attendance.forEach((record) => {
      const key = `${record.employeeId}_${record.attendanceDate}`;
      map.set(key, record);
    });

    return map;
  }, [attendance]);

  const getAttendanceRecord = (employeeId, day) => {
    const date = formatDate(year, month, day);
    return attendanceMap.get(`${employeeId}_${date}`);
  };

  const openAttendanceModal = (employee, day) => {
    const date = formatDate(year, month, day);
    const existingRecord = getAttendanceRecord(employee.id, day);

    setSelectedCell({
      employee,
      day,
      date,
      existingRecord,
    });

    setForm({
      status: existingRecord?.status || STATUS.PRESENT,
      reason: existingRecord?.reason || "",
    });

    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    if (saving) return;

    setSelectedCell(null);

    setForm({
      status: STATUS.PRESENT,
      reason: "",
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedCell) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        employeeId: selectedCell.employee.id,
        attendanceDate: selectedCell.date,
        status: form.status,
        reason: form.reason.trim() || null,
      };

      const savedRecord = await attendanceApi.create(payload);

      setAttendance((current) => {
        const existingIndex = current.findIndex(
          (record) =>
            record.employeeId === savedRecord.employeeId &&
            record.attendanceDate === savedRecord.attendanceDate
        );

        if (existingIndex === -1) {
          return [...current, savedRecord];
        }

        const updated = [...current];
        updated[existingIndex] = savedRecord;

        return updated;
      });

      setSuccess("Attendance saved successfully.");
      closeModal();
    } catch (err) {
      console.error("Failed to save attendance:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save attendance. Please try again."
      );
    } finally {
      setSaving(false);
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

  const handleResetToCurrentMonth = () => {
    setYear(getCurrentYear());
    setMonth(getCurrentMonth());
  };

  const monthName = new Date(year, month - 1).toLocaleString("en-IN", {
    month: "long",
  });

  const activeEmployees = useMemo(
    () => employees.filter((employee) => !employee.blocked),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return activeEmployees;

    const query = searchQuery.toLowerCase();

    return activeEmployees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(query) ||
        emp.mobile?.toLowerCase().includes(query)
    );
  }, [activeEmployees, searchQuery]);

  const isCurrentMonthSelected =
    year === getCurrentYear() && month === getCurrentMonth();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-3 pb-10 sm:space-y-5 sm:px-4 md:px-6 lg:px-8">

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Title */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CalendarDays size={19} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                  Attendance Management
                </h1>

                <p className="mt-0.5 text-[11px] leading-4 text-gray-500 sm:text-xs">
                  Manage daily employee attendance and remarks.
                </p>
              </div>
            </div>
          </div>

          {/* Month Controls */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {!isCurrentMonthSelected && (
              <button
                type="button"
                onClick={handleResetToCurrentMonth}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                title="Jump to current month"
              >
                <RotateCcw size={13} />
                <span>Today</span>
              </button>
            )}

            <div className="flex min-w-0 flex-1 items-center gap-1 sm:flex-none">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                aria-label="Previous Month"
              >
                ←
              </button>

              <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-xs font-semibold text-gray-800 sm:w-[150px] sm:flex-none sm:px-4 sm:text-sm">
                <span className="truncate">
                  {monthName} {year}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
                aria-label="Next Month"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 shadow-sm sm:px-4">
          <span className="min-w-0 break-words">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 font-bold text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-xs text-green-700 shadow-sm sm:px-4">
          <span className="min-w-0 break-words">{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="shrink-0 font-bold text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Legend */}
          <div className="min-w-0">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Attendance Status
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-600">

              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-green-200 bg-green-100 text-[10px] font-bold text-green-700">
                  P
                </span>
                <span>Present</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-red-200 bg-red-100 text-[10px] font-bold text-red-700">
                  A
                </span>
                <span>Absent</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-yellow-200 bg-yellow-100 text-[10px] font-bold text-yellow-700">
                  H
                </span>
                <span>Half Day</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400">
                  —
                </span>
                <span>Not Marked</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="w-full lg:w-64">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-xs outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 transition hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {loading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              Loading attendance matrix...
            </p>
          </div>
        ) : activeEmployees.length === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg">
              📅
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No active employees found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-gray-500 sm:text-sm">
              Please register an active employee before marking attendance.
            </p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center px-5 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Search size={17} className="text-gray-400" />
            </div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              No employees match "{searchQuery}"
            </p>

            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs font-medium text-blue-600 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="min-w-max border-collapse">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">

                  {/* Employee Header */}
                  <th className="sticky left-0 z-30 min-w-[180px] border-r border-gray-200 bg-gray-50 px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] sm:min-w-[220px] sm:px-4">
                    Employee ({filteredEmployees.length})
                  </th>

                  {/* Days */}
                  {days.map((day) => {
                    const dayOfWeek = new Date(
                      year,
                      month - 1,
                      day
                    ).toLocaleDateString("en-IN", {
                      weekday: "short",
                    });

                    const isWeekend =
                      dayOfWeek === "Sun" || dayOfWeek === "Sat";

                    return (
                      <th
                        key={day}
                        className={`min-w-[46px] border-r border-gray-200 px-1 py-2.5 text-center sm:min-w-[52px] ${
                          isWeekend ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="text-xs font-semibold text-gray-800 sm:text-sm">
                          {day}
                        </div>

                        <div className="text-[9px] font-normal uppercase text-gray-400 sm:text-[10px]">
                          {dayOfWeek}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                  >
                    {/* Employee Info */}
                    <td className="sticky left-0 z-20 border-r border-gray-200 bg-white px-3 py-2.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] sm:px-4 sm:py-3">
                      <div
                        className="max-w-[150px] truncate text-xs font-medium text-gray-900 sm:max-w-[200px]"
                        title={employee.name}
                      >
                        {employee.name}
                      </div>

                      <div className="mt-0.5 max-w-[150px] truncate text-[10px] text-gray-500 sm:max-w-[200px] sm:text-xs">
                        {employee.mobile || "No mobile"}
                      </div>
                    </td>

                    {/* Attendance Cells */}
                    {days.map((day) => {
                      const record = getAttendanceRecord(
                        employee.id,
                        day
                      );

                      const hasReason = Boolean(
                        record?.reason?.trim()
                      );

                      return (
                        <td
                          key={day}
                          className="border-r border-gray-100 p-1 text-center sm:p-1.5"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openAttendanceModal(
                                employee,
                                day
                              )
                            }
                            title={
                              record
                                ? `${STATUS_LABEL[record.status]}${
                                    hasReason
                                      ? ` — ${record.reason}`
                                      : ""
                                  }`
                                : "Mark attendance"
                            }
                            className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-md border text-xs font-bold transition hover:scale-105 sm:h-9 sm:w-9 ${
                              record
                                ? STATUS_STYLE[record.status]
                                : "border-gray-200 bg-gray-50 text-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500"
                            }`}
                          >
                            {record?.status === STATUS.PRESENT && (
                              <Check size={15} />
                            )}

                            {record?.status === STATUS.ABSENT && (
                              <X size={15} />
                            )}

                            {record?.status === STATUS.HALF_DAY && (
                              <Clock size={14} />
                            )}

                            {!record && "—"}

                            {hasReason && (
                              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                                <FileText size={8} />
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading &&
        activeEmployees.length > 0 &&
        filteredEmployees.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 sm:hidden">
            <span>←</span>
            <span>Swipe horizontally to view all days</span>
            <span>→</span>
          </div>
        )}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">

          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="min-w-0 pr-3">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                  Mark Attendance
                </h2>

                <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
                  {selectedCell.employee.name} ·{" "}
                  {selectedCell.date}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-200/60 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSave}
              className="space-y-5 p-4 sm:p-5"
            >
              {/* Status */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">
                  Attendance Status
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(STATUS_LABEL).map(
                    ([status, label]) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            status,
                          }))
                        }
                        className={`min-h-[42px] rounded-lg border px-2 py-2 text-[11px] font-semibold transition sm:text-xs ${
                          form.status === status
                            ? STATUS_STYLE[status]
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label
                  htmlFor="attendance-reason"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs"
                >
                  Remarks{" "}
                  <span className="font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="attendance-reason"
                  value={form.reason}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      reason: event.target.value,
                    }))
                  }
                  rows={4}
                  maxLength={255}
                  placeholder="Enter remarks if required..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <div className="mt-1 text-right text-[10px] text-gray-400 sm:text-xs">
                  {form.reason.length}/255
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed sm:w-auto sm:py-2 sm:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-slate-800 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2 sm:text-sm"
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
