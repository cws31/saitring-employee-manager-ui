import React from "react";

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
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [y, m, d] = dateStr.split("-");
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isToday = (dateStr) => {
    const todayStr = new Date().toISOString().split("T")[0];
    return dateStr === todayStr;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">
            Attendance Summary
          </h2>
          <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
            {monthName} {year}
          </p>
        </div>
      </div>

      {loading && !monthlySummary.length && !dailySummary ? (
        <div className="py-8 text-center text-xs text-gray-500">
          Loading summary...
        </div>
      ) : error ? (
        <div className="my-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <span>{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-semibold underline hover:text-red-800"
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {/* Monthly Totals Card Layout (Responsive Grid/Stack) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/60 p-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="text-xs font-medium text-green-800">Present</span>
              <span className="text-lg font-bold text-green-700 sm:mt-1 sm:text-2xl">
                {monthlyTotals.present}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/60 p-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="text-xs font-medium text-red-800">Absent</span>
              <span className="text-lg font-bold text-red-700 sm:mt-1 sm:text-2xl">
                {monthlyTotals.absent}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50/60 p-3 sm:flex-col sm:items-start sm:justify-start">
              <span className="text-xs font-medium text-yellow-800">Half Day</span>
              <span className="text-lg font-bold text-yellow-700 sm:mt-1 sm:text-2xl">
                {monthlyTotals.halfPresent}
              </span>
            </div>
          </div>

          {/* Daily Summary Box */}
          {dailySummary && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>
                  Daily Summary ·{" "}
                  {isToday(summaryDate) ? "Today" : formatDisplayDate(summaryDate)}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-6 text-xs text-gray-600">
                <div>
                  <span className="font-medium text-gray-500">Present:</span>{" "}
                  <span className="font-bold text-green-700">
                    {dailySummary.present ?? 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Absent:</span>{" "}
                  <span className="font-bold text-red-700">
                    {dailySummary.absent ?? 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Half Day:</span>{" "}
                  <span className="font-bold text-yellow-700">
                    {dailySummary.halfPresent ?? 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Monthly Breakdown Table */}
          <div>
            <div className="mb-2 text-xs font-semibold text-gray-700">
              Daily Breakdown
            </div>
            {monthlySummary.length === 0 ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 text-center text-xs text-gray-500">
                No attendance summary available for this month.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 text-[10px] font-semibold uppercase tracking-wider text-gray-500 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2 text-center">Present</th>
                      <th className="px-3 py-2 text-center">Absent</th>
                      <th className="px-3 py-2 text-center">Half Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {monthlySummary.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {formatDisplayDate(record.attendanceDate)}
                        </td>
                        <td className="px-3 py-2 text-center font-semibold text-green-700">
                          {record.present ?? 0}
                        </td>
                        <td className="px-3 py-2 text-center font-semibold text-red-700">
                          {record.absent ?? 0}
                        </td>
                        <td className="px-3 py-2 text-center font-semibold text-yellow-700">
                          {record.halfPresent ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}