import React, { useState } from "react";
import { ChevronDown, ChevronUp, Users, RefreshCw } from "lucide-react";

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
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse today's counts from dailySummary response if available
  const presentCount = dailySummary?.presentCount ?? 0;
  const absentCount = dailySummary?.absentCount ?? 0;
  const halfDayCount = dailySummary?.halfDayCount ?? 0;
  const totalEmployees = dailySummary?.totalEmployees ?? (presentCount + absentCount + halfDayCount);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-200">
      {/* Header / Default Collapsed View (Always visible: Today's / Selected Date's quick stats) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col gap-3 p-4 sm:p-5 cursor-pointer bg-gradient-to-r from-gray-50/50 to-white hover:bg-gray-50/80 transition select-none lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center justify-between lg:justify-start lg:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                  Attendance Summary
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-200">
                  {summaryDate ? `Date: ${summaryDate}` : `${monthName} ${year}`}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
                {isExpanded ? "Click to collapse full report" : "Click to view complete monthly breakdown & stats"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 lg:hidden"
          >
            <span>{isExpanded ? "Less" : "Expand"}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Quick Default Badges (Present, Absent, Half-Day) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

          <div className="hidden lg:flex items-center pl-2 text-gray-400">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expanded Full Summary Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-white p-4 sm:p-5 space-y-4 animate-fadeIn">
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

              {/* Detailed Breakdown List / Table */}
              {monthlySummary.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 font-semibold text-gray-600">Employee</th>
                        <th className="px-3 py-2 font-semibold text-green-600 text-center">Present</th>
                        <th className="px-3 py-2 font-semibold text-red-600 text-center">Absent</th>
                        <th className="px-3 py-2 font-semibold text-yellow-600 text-center">Half Day</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {monthlySummary.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900">{record.employeeName || `Employee #${record.employeeId}`}</td>
                          <td className="px-3 py-2 text-center font-semibold text-green-700">{record.present || 0}</td>
                          <td className="px-3 py-2 text-center font-semibold text-red-700">{record.absent || 0}</td>
                          <td className="px-3 py-2 text-center font-semibold text-yellow-700">{record.halfPresent || 0}</td>
                        </tr>
                      ))}
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