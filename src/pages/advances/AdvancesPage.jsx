
import React, { useEffect, useMemo, useState } from "react";
import employeeApi from "../../api/employeeApi";
import advanceApi from "../../api/advanceApi";
import { formatCurrency } from "../../utils/currency";

export default function AdvancesPage() {
  const today = new Date();

  const [employees, setEmployees] = useState([]);
  const [advances, setAdvances] = useState([]);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newAdvance, setNewAdvance] = useState({});
  const [editingAdvanceId, setEditingAdvanceId] = useState(null);
  const [editingAdvance, setEditingAdvance] = useState({
    amount: "",
    paymentDate: "",
    note: "",
  });

  const getTodayDate = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getMonthName = (monthNumber) => {
    return new Date(2000, monthNumber - 1, 1).toLocaleString("en-IN", {
      month: "long",
    });
  };

  const loadEmployees = async () => {
    try {
      const data = await employeeApi.getAll();
      const activeEmployees = (data || []).filter(
        (employee) => !employee.blocked
      );

      setEmployees(activeEmployees);

      const initialForms = {};
      activeEmployees.forEach((employee) => {
        initialForms[employee.id] = {
          amount: "",
          paymentDate: getTodayDate(),
          note: "",
        };
      });

      setNewAdvance(initialForms);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError(
        err.response?.data?.message || "Failed to load employees."
      );
    }
  };

  const loadAdvances = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await advanceApi.getMonthly(year, month);
      setAdvances(data || []);
    } catch (err) {
      console.error("Failed to load advances:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load monthly advances."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    loadAdvances();
  }, [year, month]);

  const getEmployeeAdvances = (employeeId) => {
    return advances.filter(
      (advance) => Number(advance.employeeId) === Number(employeeId)
    );
  };

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const handleNewAdvanceChange = (employeeId, field, value) => {
    setNewAdvance((previous) => ({
      ...previous,
      [employeeId]: {
        ...(previous[employeeId] || {}),
        [field]: value,
      },
    }));
  };

  const handleAddAdvance = async (employeeId) => {
    const form = newAdvance[employeeId];
    if (!form) return;

    const amount = Number(form.amount);

    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      setError("Please enter a valid advance amount.");
      return;
    }

    if (!form.paymentDate) {
      setError("Please select a payment date.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await advanceApi.create({
        employeeId: Number(employeeId),
        amount,
        paymentDate: form.paymentDate,
        note: form.note?.trim() || null,
      });

      setNewAdvance((previous) => ({
        ...previous,
        [employeeId]: {
          amount: "",
          paymentDate: getTodayDate(),
          note: "",
        },
      }));

      setSuccess("Advance added successfully.");
      await loadAdvances();
    } catch (err) {
      console.error("Failed to add advance:", err);
      setError(
        err.response?.data?.message || "Failed to add advance."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAmountKeyDown = (event, employeeId) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddAdvance(employeeId);
    }
  };

  const handleStartEdit = (advance) => {
    setEditingAdvanceId(advance.id);

    setEditingAdvance({
      amount: advance.amount ?? "",
      paymentDate: advance.paymentDate ?? "",
      note: advance.note ?? "",
    });

    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingAdvanceId(null);

    setEditingAdvance({
      amount: "",
      paymentDate: "",
      note: "",
    });
  };

  const handleEditChange = (field, value) => {
    setEditingAdvance((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSaveEdit = async (advance) => {
    const amount = Number(editingAdvance.amount);

    if (
      !editingAdvance.amount ||
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      setError("Please enter a valid advance amount.");
      return;
    }

    if (!editingAdvance.paymentDate) {
      setError("Please select a payment date.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await advanceApi.update(advance.id, {
        employeeId: Number(advance.employeeId),
        amount,
        paymentDate: editingAdvance.paymentDate,
        note: editingAdvance.note?.trim() || null,
      });

      handleCancelEdit();

      setSuccess("Advance updated successfully.");
      await loadAdvances();
    } catch (err) {
      console.error("Failed to update advance:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update advance."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdvance = async (advance) => {
    if (
      !window.confirm(
        `Delete this advance of ${formatCurrency(
          advance.amount
        )}?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await advanceApi.delete(advance.id);

      setSuccess("Advance deleted successfully.");
      await loadAdvances();
    } catch (err) {
      console.error("Failed to delete advance:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete advance."
      );
    } finally {
      setSaving(false);
    }
  };

  const employeeCards = useMemo(() => employees, [employees]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-3 pb-12 sm:px-4 md:px-6 lg:px-8">
      {/* Header & Month Selector */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-2xs sm:px-4 sm:py-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-slate-900">
            Employee Advances
          </h1>

          <p className="text-[11px] leading-4 text-slate-500">
            Manage and record monthly advance payments for active personnel.
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-start">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            ←
          </button>

          <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-center text-xs font-medium text-slate-800 sm:min-w-[120px] sm:flex-none">
            {getMonthName(month)} {year}
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            →
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 shadow-2xs">
          <span className="min-w-0 break-words">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 font-semibold text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="flex min-w-0 items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700 shadow-2xs">
          <span className="min-w-0 break-words">{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="shrink-0 font-semibold text-emerald-500 hover:text-emerald-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-2xs sm:p-10">
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="mt-2.5 text-xs text-slate-500">
            Loading advance records...
          </p>
        </div>
      ) : employeeCards.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-2xs sm:p-10">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
            👤
          </div>

          <h3 className="mt-2.5 text-xs font-semibold text-slate-900">
            No active employees found
          </h3>

          <p className="mx-auto mt-0.5 max-w-md text-[11px] text-slate-500">
            Please register an active employee before recording advances.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {employeeCards.map((employee) => {
            const employeeAdvances = getEmployeeAdvances(employee.id);

            const totalAdvance = employeeAdvances.reduce(
              (sum, adv) =>
                sum + Math.abs(Number(adv.amount || 0)),
              0
            );

            const form = newAdvance[employee.id] || {
              amount: "",
              paymentDate: getTodayDate(),
              note: "",
            };

            return (
              <div
                key={employee.id}
                className="flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"
              >
                {/* Employee Header */}
                <div className="flex min-w-0 items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/75 px-3 py-2.5 sm:px-3.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-semibold text-indigo-700">
                      {employee.name?.charAt(0)?.toUpperCase() || "E"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-semibold text-slate-900">
                        {employee.name}
                      </h3>

                      <p className="truncate text-[10px] text-slate-500">
                        {employee.mobile || "No mobile"}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="whitespace-nowrap rounded-md border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-700 sm:px-2 sm:text-[10px]">
                      Total: {formatCurrency(totalAdvance)}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="flex min-w-0 flex-col gap-3 p-3 sm:p-3.5">
                  {/* Existing Records Section */}
                  <div className="min-w-0">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        History
                      </h4>

                      <span className="shrink-0 text-[10px] font-medium text-slate-500">
                        {employeeAdvances.length}{" "}
                        {employeeAdvances.length === 1
                          ? "entry"
                          : "entries"}
                      </span>
                    </div>

                    {employeeAdvances.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-2 text-center">
                        <p className="text-[10px] text-slate-400">
                          No advances logged this month.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-36 space-y-1.5 overflow-y-auto pr-0.5">
                        {employeeAdvances.map((advance) => {
                          const isEditing =
                            editingAdvanceId === advance.id;

                          const amountVal = Number(advance.amount);

                          const isPreviousBalance =
                            amountVal < 0 ||
                            (advance.note &&
                              advance.note
                                .toLowerCase()
                                .includes(
                                  "previous month balance"
                                ));

                          const amountColorClass =
                            isPreviousBalance
                              ? amountVal < 0
                                ? "text-rose-600"
                                : "text-emerald-600"
                              : "text-slate-900";

                          return (
                            <div
                              key={advance.id}
                              className="rounded-lg border border-slate-200 bg-white p-2 shadow-2xs"
                            >
                              {isEditing ? (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                                    <div>
                                      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                        Amount
                                      </label>

                                      <input
                                        type="number"
                                        step="0.01"
                                        value={editingAdvance.amount}
                                        onChange={(e) =>
                                          handleEditChange(
                                            "amount",
                                            e.target.value
                                          )
                                        }
                                        className="w-full min-w-0 rounded-md border border-slate-300 px-2 py-1.5 text-[11px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                        Date
                                      </label>

                                      <input
                                        type="date"
                                        value={
                                          editingAdvance.paymentDate
                                        }
                                        onChange={(e) =>
                                          handleEditChange(
                                            "paymentDate",
                                            e.target.value
                                          )
                                        }
                                        className="w-full min-w-0 rounded-md border border-slate-300 px-2 py-1.5 text-[11px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                                      Remarks
                                    </label>

                                    <input
                                      type="text"
                                      value={editingAdvance.note}
                                      onChange={(e) =>
                                        handleEditChange(
                                          "note",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Optional remarks"
                                      className="w-full min-w-0 rounded-md border border-slate-300 px-2 py-1.5 text-[11px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>

                                  <div className="flex flex-wrap justify-end gap-1 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      disabled={saving}
                                      className="rounded-md border border-slate-300 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSaveEdit(advance)
                                      }
                                      disabled={saving}
                                      className="rounded-md bg-indigo-600 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                      {saving ? "Saving..." : "Save"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex min-w-0 items-center justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                                      <span
                                        className={`text-[11px] font-semibold ${amountColorClass}`}
                                      >
                                        {formatCurrency(advance.amount)}
                                      </span>

                                      {advance.paymentDate && (
                                        <span className="text-[10px] text-slate-400">
                                          {advance.paymentDate}
                                        </span>
                                      )}
                                    </div>

                                    {advance.note && (
                                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                                        {advance.note}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex shrink-0 items-center gap-0.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStartEdit(advance)
                                      }
                                      className="rounded px-1.5 py-1 text-[10px] font-medium text-indigo-600 hover:bg-indigo-50"
                                    >
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteAdvance(advance)
                                      }
                                      disabled={saving}
                                      className="rounded px-1.5 py-1 text-[10px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Add New Advance Form */}
                  <div className="border-t border-slate-100 pt-2.5">
                    <h4 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      New Entry
                    </h4>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                        <div>
                          <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                            Amount
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) =>
                              handleNewAdvanceChange(
                                employee.id,
                                "amount",
                                e.target.value
                              )
                            }
                            onKeyDown={(e) =>
                              handleAmountKeyDown(
                                e,
                                employee.id
                              )
                            }
                            placeholder="0.00"
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                            Date
                          </label>

                          <input
                            type="date"
                            value={form.paymentDate}
                            onChange={(e) =>
                              handleNewAdvanceChange(
                                employee.id,
                                "paymentDate",
                                e.target.value
                              )
                            }
                            className="w-full min-w-0 rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-0.5 block text-[10px] font-medium text-slate-600">
                          Remarks
                        </label>

                        <input
                          type="text"
                          value={form.note}
                          onChange={(e) =>
                            handleNewAdvanceChange(
                              employee.id,
                              "note",
                              e.target.value
                            )
                          }
                          placeholder="Optional notes"
                          className="w-full min-w-0 rounded-lg border border-slate-300 px-2 py-1.5 text-[11px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleAddAdvance(employee.id)
                          }
                          disabled={saving}
                        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-[11px] font-medium text-white transition hover:bg-slate-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving
                            ? "Saving..."
                            : "+ Add Advance"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
