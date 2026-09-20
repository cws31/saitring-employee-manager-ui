import React, { useState } from "react";
import { ChevronDown, ChevronUp, Users, RefreshCw, Calendar } from "lucide-react";

export default function AttendanceSummary({
  dailySummary,
  monthlySummary,
  monthlyTotals,
  loading,
  error,
  monthName,
  year,
  summaryDate,
  onRetry,
  onDateChange,
  employees = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse present, absent, half-day counts for the selected date
  const presentCount = dailySummary?.presentCount ?? 0;
  const absentCount = dailySummary?.absentCount ?? 0;
  const halfDayCount = dailySummary?.halfDayCount ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-200">
      {/* Default Collapsed View: Shows only current/selected date counts & Date Picker */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 bg-gradient-to-r from-gray-50/50 to-white lg:flex-row lg:items-center lg:justify-between border-b border-gray-100">
        
        {/* Left Side: Title & Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                Attendance Summary
              </h2>
              <p className="text-[11px] text-gray-500 sm:text-xs">
                Quick counts for selected date
              </p>
            </div>
          </div>

          {/* Date Selector Input */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 shadow-xs">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <input
              type="date"
              value={summaryDate || ""}
              onChange={(e) => {
                if (e.target.value && onDateChange) {
                  onDateChange(e.target.value);
                }
              }}
              className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Right Side: Default Quick Badges (Present, Absent, Half-Day) & Expand Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">Present</span>
            <span className="text-sm font-extrabold text-green-700">{presentCount}</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Absent</span>
            <span className="text-sm font-extrabold text-red-700">{absentCount}</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Half Day</span>
            <span className="text-sm font-extrabold text-yellow-700">{halfDayCount}</span>
          </div>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-gray-50 transition shadow-xs"
          >
            <span>{isExpanded ? "Hide Full Report" : "View Full Report"}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Full Summary Content (Completely hidden by default) */}
      {isExpanded && (
        <div className="bg-white p-4 sm:p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-semibold text-gray-500">
              Complete Breakdown for {monthName} {year}
            </span>
          </div>

          {error && (
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              <span>{error}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-1 font-semibold hover:underline"
                >
                  <RefreshCw size={12} /> Retry
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
              <span className="ml-2 text-xs text-gray-500">Loading complete summary...</span>
            </div>
          ) : (
            <>
              {/* Monthly Aggregate Totals */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total Present (Month)</div>
                  <div className="mt-1 text-lg font-bold text-green-700">{monthlyTotals.present}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total Absent (Month)</div>
                  <div className="mt-1 text-lg font-bold text-red-700">{monthlyTotals.absent}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total Half-Day (Month)</div>
                  <div className="mt-1 text-lg font-bold text-yellow-700">{monthlyTotals.halfPresent}</div>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              {monthlySummary.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 max-h-64">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 font-semibold text-gray-600">Employee</th>
                        <th className="px-3 py-2 font-semibold text-green-600 text-center">Present</th>
                        <th className="px-3 py-2 font-semibold text-red-600 text-center">Absent</th>
                        <th className="px-3 py-2 font-semibold text-yellow-600 text-center">Half Day</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {monthlySummary.map((record, index) => {
                        const empName = record.employeeName || record.name || employees.find(e => e.id === record.employeeId)?.name;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium text-gray-900">{empName || `Employee #${record.employeeId}`}</td>
                            <td className="px-3 py-2 text-center font-semibold text-green-700">{record.present || 0}</td>
                            <td className="px-3 py-2 text-center font-semibold text-red-700">{record.absent || 0}</td>
                            <td className="px-3 py-2 text-center font-semibold text-yellow-700">{record.halfPresent || 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}