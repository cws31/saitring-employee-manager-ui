import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  RefreshCw,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

const formatDisplayDate = (date) => {
  if (!date) return "";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AttendanceSummary({
  dailySummary,
  monthlySummary = [],
  monthlyTotals,
  loading,
  error,
  monthName,
  year,
  summaryDate,
  onRetry,
  onDateChange,
}) {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  const presentCount = Number(dailySummary?.present ?? 0);
  const absentCount = Number(dailySummary?.absent ?? 0);
  const halfPresentCount = Number(dailySummary?.halfPresent ?? 0);

  const totalMarked =
    presentCount + absentCount + halfPresentCount;

 const toggleSummary = () => {
  setIsSummaryExpanded((current) => {
    const next = !current;

    if (!next) {
      setIsReportExpanded(false);
    }

    return next;
  });
};

  const toggleReport = (event) => {
    event.stopPropagation();
    setIsReportExpanded((current) => !current);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`flex flex-col gap-4 bg-gradient-to-r from-gray-50/70 to-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between ${
          isSummaryExpanded ? "border-b border-gray-100" : ""
        }`}
      >
        <button
          type="button"
          onClick={toggleSummary}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={isSummaryExpanded}
          aria-label={
            isSummaryExpanded
              ? "Collapse Attendance Summary"
              : "Expand Attendance Summary"
          }
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Users size={20} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900 sm:text-base">
              Attendance Summary
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
              Daily attendance overview
            </p>
          </div>

          <span className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50">
            {isSummaryExpanded ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}
          </span>
        </button>

        {isSummaryExpanded && (
          <div
            className="flex flex-wrap items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm">
              <Calendar
                size={14}
                className="shrink-0 text-gray-400"
              />

              <input
                type="date"
                value={summaryDate || ""}
                onChange={(event) => {
                  if (event.target.value && onDateChange) {
                    onDateChange(event.target.value);
                  }
                }}
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={toggleReport}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
              aria-expanded={isReportExpanded}
            >
              {isReportExpanded ? "Hide Report" : "View Report"}

              {isReportExpanded ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>
          </div>
        )}
      </div>

      {isSummaryExpanded && (
        <>
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Selected Date
                </p>

                <p className="mt-1 text-sm font-bold text-gray-900">
                  {formatDisplayDate(summaryDate)}
                </p>
              </div>

              <div className="text-xs text-gray-500">
                Total marked:{" "}
                <span className="font-bold text-gray-800">
                  {totalMarked}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                <span>{error}</span>

                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="flex shrink-0 items-center gap-1 font-semibold hover:underline"
                  >
                    <RefreshCw size={12} />
                    Retry
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                <span className="ml-2 text-xs text-gray-500">
                  Loading summary...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-green-200 bg-green-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                        Present
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-green-700">
                        {presentCount}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <CheckCircle2 size={21} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Absent
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-red-700">
                        {absentCount}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <XCircle size={21} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">
                        Half Day
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-yellow-700">
                        {halfPresentCount}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                      <Clock3 size={21} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isReportExpanded && (
            <div className="border-t border-gray-100 bg-gray-50/40 p-4 sm:p-5">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900">
                  {monthName} {year} Report
                </h3>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  Daily attendance breakdown for the selected month.
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
                </div>
              ) : (
                <>
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Present
                      </p>

                      <p className="mt-1 text-lg font-bold text-green-700">
                        {monthlyTotals?.present ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Absent
                      </p>

                      <p className="mt-1 text-lg font-bold text-red-700">
                        {monthlyTotals?.absent ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Half Day
                      </p>

                      <p className="mt-1 text-lg font-bold text-yellow-700">
                        {monthlyTotals?.halfPresent ?? 0}
                      </p>
                    </div>
                  </div>

                  {monthlySummary.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <div className="max-h-72 overflow-y-auto">
                        <table className="min-w-full text-left text-xs">
                          <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 font-semibold text-gray-600">
                                Date
                              </th>

                              <th className="px-4 py-3 text-center font-semibold text-green-600">
                                Present
                              </th>

                              <th className="px-4 py-3 text-center font-semibold text-red-600">
                                Absent
                              </th>

                              <th className="px-4 py-3 text-center font-semibold text-yellow-600">
                                Half Day
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-100">
                            {monthlySummary.map((record, index) => (
                              <tr
                                key={`${record.attendanceDate}-${index}`}
                                className="transition hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 font-medium text-gray-900">
                                  {formatDisplayDate(
                                    record.attendanceDate
                                  )}
                                </td>

                                <td className="px-4 py-3 text-center font-semibold text-green-700">
                                  {Number(record.present ?? 0)}
                                </td>

                                <td className="px-4 py-3 text-center font-semibold text-red-700">
                                  {Number(record.absent ?? 0)}
                                </td>

                                <td className="px-4 py-3 text-center font-semibold text-yellow-700">
                                  {Number(
                                    record.halfPresent ?? 0
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
                      <p className="text-xs font-medium text-gray-500">
                        No attendance summary available for this month.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
