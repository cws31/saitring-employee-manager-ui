import React, { useEffect, useMemo, useState } from "react";
import monthClosingApi from "../../api/monthClosingApi";
import settlementApi from "../../api/settlementApi";
import { formatCurrency } from "../../utils/currency";

const getInitialDate = () => {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

const getMonthName = (month) => {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", {
    month: "long",
  });
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MonthClosingPage() {
  const initialDate = getInitialDate();

  const [year, setYear] = useState(initialDate.year);
  const [month, setMonth] = useState(initialDate.month);

  const [monthClosing, setMonthClosing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Pay Now modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    amountPaid: "",
    settlementDate: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [paymentLoading, setPaymentLoading] = useState(false);

  // Settlement history modal
  const [showSettlementRecords, setShowSettlementRecords] =
    useState(false);
  const [settlementRecords, setSettlementRecords] = useState([]);
  const [settlementEmployee, setSettlementEmployee] = useState(null);

  // Edit settlement modal
  const [showEditSettlement, setShowEditSettlement] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  const [editSettlementForm, setEditSettlementForm] = useState({
    amountPaid: "",
    settlementDate: "",
    note: "",
  });

  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==================================================
  // LOAD MONTH CLOSING
  // ==================================================

  const loadMonthClosing = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await monthClosingApi.getByYearMonth(year, month);

      setMonthClosing(data);
    } catch (err) {
      console.error("Failed to load month closing:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load month closing data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMonthClosing();
  }, [year, month]);


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

  const handleMonthChange = (event) => {
    setMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
  };


  const details = monthClosing?.details || [];

  const totalEmployees =
    monthClosing?.totalEmployees ?? details.length;

  const totalPayable = monthClosing?.totalPayable ?? 0;

  const totalOverAdvance =
    monthClosing?.totalOverAdvance ?? 0;

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: 7 },
      (_, index) => currentYear - 3 + index
    );
  }, []);

  const openPaymentModal = (detail) => {
    setSelectedDetail(detail);

    setPaymentForm({
      amountPaid: "",
      settlementDate:
        new Date().toISOString().split("T")[0],
      note: `Settlement for ${getMonthName(month)} ${year}`,
    });

    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    if (paymentLoading) return;

    setShowPaymentModal(false);
    setSelectedDetail(null);
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDetail) return;

    if (
      !paymentForm.amountPaid ||
      Number(paymentForm.amountPaid) <= 0
    ) {
      alert("Please enter a valid settlement amount.");
      return;
    }

    try {
      setPaymentLoading(true);

      await settlementApi.create({
        employeeId: Number(selectedDetail.employee.id),
        amountPaid: Number(paymentForm.amountPaid),
        settlementDate: paymentForm.settlementDate,
        note: paymentForm.note,
      });

      setShowPaymentModal(false);
      setSelectedDetail(null);

      await loadMonthClosing(true);
    } catch (err) {
      console.error("Failed to create settlement:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to create settlement."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const openSettlementRecords = (detail) => {
    const records = detail?.settlements || [];

    setSettlementRecords(records);

    setSettlementEmployee({
      id: detail?.employee?.id,
      name:
        detail?.employee?.name ||
        detail?.employeeName ||
        "Employee",
    });

    setShowSettlementRecords(true);
  };

  const closeSettlementRecords = () => {
    if (editLoading || deleteLoading) return;

    setShowSettlementRecords(false);
    setSettlementRecords([]);
    setSettlementEmployee(null);
  };

  const openEditSettlement = (settlement) => {
    setSelectedSettlement(settlement);

    setEditSettlementForm({
      amountPaid: settlement?.amountPaid ?? "",
      settlementDate:
        settlement?.settlementDate ||
        new Date().toISOString().split("T")[0],
      note: settlement?.note || "",
    });

    setShowEditSettlement(true);
  };

  const closeEditSettlement = () => {
    if (editLoading) return;

    setShowEditSettlement(false);
    setSelectedSettlement(null);
  };

  const handleEditSettlementChange = (event) => {
    const { name, value } = event.target;

    setEditSettlementForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSettlement = async (event) => {
    event.preventDefault();

    if (!selectedSettlement) return;

    if (
      !editSettlementForm.amountPaid ||
      Number(editSettlementForm.amountPaid) <= 0
    ) {
      alert("Please enter a valid settlement amount.");
      return;
    }

    try {
      setEditLoading(true);

      await settlementApi.update(selectedSettlement.id, {
        employeeId: Number(
          selectedSettlement.employee?.id ||
            settlementEmployee?.id
        ),
        amountPaid: Number(
          editSettlementForm.amountPaid
        ),
        settlementDate:
          editSettlementForm.settlementDate,
        note: editSettlementForm.note,
      });

      setShowEditSettlement(false);
      setSelectedSettlement(null);

      await loadMonthClosing(true);

      setShowSettlementRecords(false);
    } catch (err) {
      console.error("Failed to update settlement:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to update settlement."
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSettlement = async (settlement) => {
    if (!settlement?.id) return;

    const confirmed = window.confirm(
      `Delete this settlement of ${formatCurrency(
        settlement.amountPaid
      )}?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await settlementApi.delete(settlement.id);

      setSettlementRecords((prev) =>
        prev.filter(
          (item) => item.id !== settlement.id
        )
      );

      await loadMonthClosing(true);
    } catch (err) {
      console.error("Failed to delete settlement:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete settlement."
      );
    } finally {
      setDeleteLoading(false);
    }
  };


  const handleToggleHisabComplete = async (detail) => {
    try {
      await monthClosingApi.markDetailCompleted(
        detail.id,
        !detail.hisabCompleted
      );

      await loadMonthClosing(true);
    } catch (err) {
      console.error(
        "Failed to update hisab status:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to update status."
      );
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />

          <p className="mt-3 text-sm text-gray-500">
            Loading month closing...
          </p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-sm font-semibold text-red-800">
          Unable to load month closing
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadMonthClosing()}
          className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
 

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Month Closing
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review employee hisab, settlements and
            remaining balances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadMonthClosing(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Reporting Period
            </p>

            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              {getMonthName(month)} {year}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              ←
            </button>

            <select
              value={month}
              onChange={handleMonthChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >
              {Array.from(
                { length: 12 },
                (_, index) => index + 1
              ).map((monthNumber) => (
                <option
                  key={monthNumber}
                  value={monthNumber}
                >
                  {getMonthName(monthNumber)}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={handleYearChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >
              {availableYears.map((yearValue) => (
                <option
                  key={yearValue}
                  value={yearValue}
                >
                  {yearValue}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Active Employees"
          value={totalEmployees}
        />

        <SummaryCard
          title="Total Payable"
          value={formatCurrency(totalPayable)}
          valueClassName="text-green-600"
        />

        <SummaryCard
          title="Total Over Advance"
          value={formatCurrency(totalOverAdvance)}
          valueClassName="text-red-600"
        />
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Employee
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Presence
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Rate
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Earning
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Advance
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Previous Balance
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Net Payable
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Settlement
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Remaining
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {details.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-gray-700">
                      No employee records
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      No active employee data is available
                      for this month.
                    </p>
                  </td>
                </tr>
              ) : (
                details.map((detail) => {
                  const settlements =
                    detail.settlements || [];

                  const remainingBalance = Number(
                    detail.remainingBalance || 0
                  );

                  return (
                    <tr
                      key={detail.id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Employee */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {detail.employeeName ||
                              detail.employee?.name ||
                              "Unknown Employee"}
                          </p>

                          {detail.employee?.mobile && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              {detail.employee.mobile}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Presence */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-800">
                          {detail.totalPresences ?? 0}
                        </span>
                      </td>

                      {/* Rate */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {formatCurrency(detail.rate)}
                        </span>
                      </td>

                      {/* Earning */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(
                            detail.totalEarning
                          )}
                        </span>
                      </td>

                      {/* Advance */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {formatCurrency(
                            detail.totalAdvance
                          )}
                        </span>
                      </td>

                      {/* Previous Balance */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {formatCurrency(
                            detail.previousBalance
                          )}
                        </span>
                      </td>

                      {/* Net Payable */}
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(
                            detail.netPayable
                          )}
                        </span>
                      </td>

                      {/* Settlement */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            openSettlementRecords(detail)
                          }
                          className="text-left transition hover:opacity-70"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(
                              detail.amountPaid
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-blue-600">
                            {settlements.length}{" "}
                            {settlements.length === 1
                              ? "settlement"
                              : "settlements"}
                          </p>
                        </button>
                      </td>

                      {/* Remaining */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            remainingBalance > 0
                              ? "text-green-600"
                              : remainingBalance < 0
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {formatCurrency(
                            detail.remainingBalance
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleHisabComplete(
                              detail
                            )
                          }
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            detail.hisabCompleted
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {detail.hisabCompleted
                            ? "Completed"
                            : "Pending"}
                        </button>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            openPaymentModal(detail)
                          }
                          className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                        >
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        {details.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-700">
              No employee records
            </p>

            <p className="mt-1 text-sm text-gray-500">
              No active employee data is available for
              this month.
            </p>
          </div>
        ) : (
          details.map((detail) => {
            const settlements = detail.settlements || [];

            const remainingBalance = Number(
              detail.remainingBalance || 0
            );

            return (
              <div
                key={detail.id}
                className="rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Employee Header */}
                <div className="flex items-start justify-between border-b border-gray-100 p-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {detail.employeeName ||
                        detail.employee?.name ||
                        "Unknown Employee"}
                    </h3>

                    {detail.employee?.mobile && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {detail.employee.mobile}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleHisabComplete(
                        detail
                      )
                    }
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      detail.hisabCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {detail.hisabCompleted
                      ? "Completed"
                      : "Pending"}
                  </button>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 sm:grid-cols-3">
                  <MobileDetail
                    label="Presence"
                    value={detail.totalPresences ?? 0}
                  />

                  <MobileDetail
                    label="Rate"
                    value={formatCurrency(detail.rate)}
                  />

                  <MobileDetail
                    label="Earning"
                    value={formatCurrency(
                      detail.totalEarning
                    )}
                  />

                  <MobileDetail
                    label="Advance"
                    value={formatCurrency(
                      detail.totalAdvance
                    )}
                  />

                  <MobileDetail
                    label="Previous Balance"
                    value={formatCurrency(
                      detail.previousBalance
                    )}
                  />

                  <MobileDetail
                    label="Net Payable"
                    value={formatCurrency(
                      detail.netPayable
                    )}
                  />

                  {/* Settlement */}
                  <div>
                    <p className="text-xs text-gray-500">
                      Settlement
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        openSettlementRecords(detail)
                      }
                      className="mt-1 text-left transition hover:opacity-70"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(
                          detail.amountPaid
                        )}
                      </p>

                      <p className="mt-0.5 text-xs text-blue-600">
                        {settlements.length}{" "}
                        {settlements.length === 1
                          ? "settlement"
                          : "settlements"}
                      </p>
                    </button>
                  </div>

                  {/* Remaining */}
                  <MobileDetail
                    label="Remaining"
                    value={formatCurrency(
                      detail.remainingBalance
                    )}
                    valueClassName={
                      remainingBalance > 0
                        ? "text-green-600"
                        : remainingBalance < 0
                        ? "text-red-600"
                        : "text-gray-700"
                    }
                  />
                </div>

                {/* Action */}
                <div className="border-t border-gray-100 p-4">
                  <button
                    type="button"
                    onClick={() =>
                      openPaymentModal(detail)
                    }
                    className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showPaymentModal && selectedDetail && (
        <ModalOverlay onClose={closePaymentModal}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Settlement
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedDetail.employeeName ||
                  selectedDetail.employee?.name}
              </p>
            </div>

            <form
              onSubmit={handlePaymentSubmit}
              className="space-y-4 p-6"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  name="amountPaid"
                  min="0"
                  step="0.01"
                  value={paymentForm.amountPaid}
                  onChange={handlePaymentChange}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Settlement Date
                </label>

                <input
                  type="date"
                  name="settlementDate"
                  value={paymentForm.settlementDate}
                  onChange={handlePaymentChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Note
                </label>

                <textarea
                  name="note"
                  rows="3"
                  value={paymentForm.note}
                  onChange={handlePaymentChange}
                  placeholder="Optional note"
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePaymentModal}
                  disabled={paymentLoading}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paymentLoading
                    ? "Saving..."
                    : "Save Settlement"}
                </button>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}

      {showSettlementRecords && (
        <ModalOverlay onClose={closeSettlementRecords}>
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Settlement History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {settlementEmployee?.name ||
                    "Employee"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeSettlementRecords}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-6">
              {settlementRecords.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    No settlements
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    No settlement records are available
                    for this employee.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlementRecords.map(
                    (settlement) => (
                      <div
                        key={settlement.id}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {formatCurrency(
                                settlement.amountPaid
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(
                                settlement.settlementDate
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                openEditSettlement(
                                  settlement
                                )
                              }
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSettlement(
                                  settlement
                                )
                              }
                              disabled={deleteLoading}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {settlement.note && (
                          <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600">
                            {settlement.note}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </ModalOverlay>
      )}

      {showEditSettlement && selectedSettlement && (
        <ModalOverlay onClose={closeEditSettlement}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Settlement
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update settlement details.
              </p>
            </div>

            <form
              onSubmit={handleUpdateSettlement}
              className="space-y-4 p-6"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  name="amountPaid"
                  min="0"
                  step="0.01"
                  value={editSettlementForm.amountPaid}
                  onChange={handleEditSettlementChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Settlement Date
                </label>

                <input
                  type="date"
                  name="settlementDate"
                  value={
                    editSettlementForm.settlementDate
                  }
                  onChange={handleEditSettlementChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Note
                </label>

                <textarea
                  name="note"
                  rows="3"
                  value={editSettlementForm.note}
                  onChange={handleEditSettlementChange}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                  placeholder="Optional note"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditSettlement}
                  disabled={editLoading}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editLoading
                    ? "Updating..."
                    : "Update Settlement"}
                </button>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}


function SummaryCard({
  title,
  value,
  valueClassName = "text-gray-900",
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p
        className={`mt-2 text-2xl font-semibold tracking-tight ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}


function MobileDetail({
  label,
  value,
  valueClassName = "text-gray-900",
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-semibold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}


function ModalOverlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      {children}
    </div>
  );
}