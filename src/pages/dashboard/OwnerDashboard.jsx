import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import dashboardApi from "../../api/dashboardApi";
import { formatCurrency } from "../../utils/currency";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function OwnerDashboard() {
  const currentDate = new Date();

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await dashboardApi.getDashboard(
        year,
        month
      );

      setDashboard(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [year, month]);

  const selectedMonth =
    months.find((item) => item.value === month)?.label ||
    "";

  return (
    <div className="min-h-full">

      <div className="mb-6 flex flex-col gap-5 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
            Keep track of your workforce and monthly
            finances.
          </p>
        </div>

        {/* Month / Year */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <select
            value={month}
            onChange={(e) =>
              setMonth(Number(e.target.value))
            }
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:w-36 sm:flex-none"
          >
            {months.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            {[2024, 2025, 2026, 2027].map(
              (yearValue) => (
                <option
                  key={yearValue}
                  value={yearValue}
                >
                  {yearValue}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="self-start rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 sm:self-auto"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <DashboardLoading />
      ) : (
        <>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">
              {selectedMonth} {year}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Current monthly overview
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Active Employees"
              value={
                dashboard?.totalActiveEmployees ?? 0
              }
              type="employees"
              description="Currently active employees"
            />

            <DashboardCard
              title="Total Payable"
              value={formatCurrency(
                dashboard?.totalPayableAmount ?? 0
              )}
              type="payable"
              description="Amount currently payable"
            />

            <DashboardCard
              title="Total Advance"
              value={formatCurrency(
                dashboard?.totalAdvanceAmount ?? 0
              )}
              type="advance"
              description="Advance amount recorded"
            />

            <DashboardCard
              title="Over Advance"
              value={formatCurrency(
                dashboard?.totalOverAdvanceAmount ?? 0
              )}
              type="overAdvance"
              description="Amount exceeding payable"
            />
          </div>
        </>
      )}
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}