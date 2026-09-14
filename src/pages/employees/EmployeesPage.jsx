import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  Users,
  UserCheck,
  UserX,
  X,
  RotateCcw,
} from "lucide-react";

import employeeApi from "../../api/employeeApi";
import EmployeeModal from "../../components/employees/EmployeeModal";
import { formatCurrency } from "../../utils/currency";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, BLOCKED
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await employeeApi.getAll();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      if (statusFilter === "ACTIVE" && employee.blocked) return false;
      if (statusFilter === "BLOCKED" && !employee.blocked) return false;

      if (!query) return true;

      return (
        employee.name?.toLowerCase().includes(query) ||
        employee.mobile?.toLowerCase().includes(query)
      );
    });
  }, [employees, search, statusFilter]);

  const openAddModal = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (actionLoading) {
      return;
    }

    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async (employeeData) => {
    try {
      setActionLoading(true);

      if (selectedEmployee) {
        await employeeApi.update(selectedEmployee.id, employeeData);
      } else {
        await employeeApi.create(employeeData);
      }

      closeModal();
      await loadEmployees();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Unable to save employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBlock = async (employee) => {
    const action = employee.blocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${employee.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await employeeApi.toggleBlock(employee.id);
      await loadEmployees();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || `Unable to ${action} employee.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Delete ${employee.name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await employeeApi.delete(employee.id);
      await loadEmployees();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Unable to delete employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const activeCount = employees.filter(
    (employee) => !employee.blocked
  ).length;

  const blockedCount = employees.filter(
    (employee) => employee.blocked
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-3 pb-10 sm:space-y-6 sm:px-5 lg:px-6">
     
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 sm:h-10 sm:w-10">
              <Users size={21} />
            </div>

            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              Employee Directory
            </h1>
          </div>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">
            Manage your workforce, contact numbers, and initial pay rates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-900 active:scale-[0.99] sm:w-auto"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* ==================== SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Total */}
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
            statusFilter === "ALL"
              ? "border-slate-400 ring-1 ring-slate-400"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 sm:h-11 sm:w-11">
              <Users size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">
                Total Employees
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {employees.length}
              </p>
            </div>
          </div>
        </div>

        {/* Active */}
        <div
          onClick={() => setStatusFilter("ACTIVE")}
          className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
            statusFilter === "ACTIVE"
              ? "border-green-500 ring-1 ring-green-500"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 sm:h-11 sm:w-11">
              <UserCheck size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">
                Active Employees
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {activeCount}
              </p>
            </div>
          </div>
        </div>

        {/* Blocked */}
        <div
          onClick={() => setStatusFilter("BLOCKED")}
          className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
            statusFilter === "BLOCKED"
              ? "border-red-500 ring-1 ring-red-500"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 sm:h-11 sm:w-11">
              <UserX size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">
                Blocked Employees
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {blockedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80 lg:w-96">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or mobile..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-9 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {statusFilter !== "ALL" && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500">
                Filtered by:{" "}
                <strong className="capitalize text-gray-800">
                  {statusFilter.toLowerCase()}
                </strong>
              </span>

              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="m-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:m-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center p-8 sm:min-h-[320px] sm:p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-slate-700" />

            <p className="mt-4 text-sm text-gray-500">
              Loading employees...
            </p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[280px] flex-col items-center justify-center px-5 py-12 text-center sm:min-h-[320px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Users size={30} className="text-gray-400" />
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-800">
              {search || statusFilter !== "ALL"
                ? "No matching employees found"
                : "No employees added yet"}
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500">
              {search || statusFilter !== "ALL"
                ? "Try adjusting your search query or status filter."
                : "Get started by registering your first employee."}
            </p>

            {search || statusFilter !== "ALL" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <RotateCcw size={14} />
                Reset filters
              </button>
            ) : (
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-900"
              >
                <Plus size={16} />
                Add Employee
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile table hint */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-400 sm:hidden">
              <span>Employee list</span>
              <span>Swipe horizontally →</span>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border-collapse">
                <thead className="border-b border-gray-200 bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                      Employee
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                      Mobile
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                      Initial Rate
                    </th>

                    <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                      Status
                    </th>

                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 sm:px-6">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      {/* Employee */}
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {employee.name?.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p
                              className="max-w-[220px] truncate text-sm font-medium text-gray-900"
                              title={employee.name}
                            >
                              {employee.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              ID #{employee.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600 sm:px-6">
                        {employee.mobile || "—"}
                      </td>

                      {/* Initial Rate */}
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900 sm:px-6">
                        {formatCurrency(employee.initialRate)}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                            employee.blocked
                              ? "border-red-200/60 bg-red-50 text-red-700"
                              : "border-green-200/60 bg-green-50 text-green-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              employee.blocked
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          />

                          {employee.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(employee)}
                            disabled={actionLoading}
                            title="Edit employee"
                            className="rounded-lg p-2.5 text-gray-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* Block / Unblock */}
                          <button
                            onClick={() => handleToggleBlock(employee)}
                            disabled={actionLoading}
                            title={
                              employee.blocked
                                ? "Unblock employee"
                                : "Block employee"
                            }
                            className="rounded-lg p-2.5 text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
                          >
                            {employee.blocked ? (
                              <Unlock size={17} />
                            ) : (
                              <Lock size={17} />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(employee)}
                            disabled={actionLoading}
                            title="Delete employee"
                            className="rounded-lg p-2.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <EmployeeModal
        open={modalOpen}
        employee={selectedEmployee}
        loading={actionLoading}
        onClose={closeModal}
        onSubmit={handleSave}
      />
    </div>
  );
}