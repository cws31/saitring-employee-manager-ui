
import React, { useState, useEffect } from "react";
import { monthClosingService } from "../../api/HisabService";
import { settlementService } from "../../api/settlementService";

const MonthClosingPage = () => {
    const currentDate = new Date();

    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);

    const [selectedClosing, setSelectedClosing] = useState(null);
    const [rowPaymentInputs, setRowPaymentInputs] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [activeHistoryEmployee, setActiveHistoryEmployee] =
        useState(null);

    const [showSettlementModal, setShowSettlementModal] =
        useState(false);

    const [settlementForm, setSettlementForm] = useState({
        id: null,
        employeeId: "",
        amountPaid: "",
        settlementDate: new Date().toISOString().split("T")[0],
        note: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});

    /*
     * Extract the backend message returned by GlobalExceptionHandler.
     */
    const getBackendErrorMessage = (err, fallbackMessage) => {
        const response = err.response?.data;

        if (response?.message) {
            return response.message;
        }

        if (typeof response === "string") {
            return response;
        }

        if (err.message) {
            return err.message;
        }

        return fallbackMessage;
    };

    /*
     * Extract validation errors returned by the backend.
     */
    const getBackendFieldErrors = (err) => {
        const response = err.response?.data;

        if (
            response?.errors &&
            typeof response.errors === "object"
        ) {
            return response.errors;
        }

        return {};
    };

    const clearFieldError = (field) => {
        setFieldErrors((previous) => {
            if (!previous[field]) {
                return previous;
            }

            const updatedErrors = {
                ...previous
            };

            delete updatedErrors[field];

            return updatedErrors;
        });
    };

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const showSuccessMessage = (message) => {
        setError("");
        setSuccess(message);

        setTimeout(() => {
            setSuccess("");
        }, 2500);
    };

    useEffect(() => {
        if (year && month) {
            loadMonthReport(year, month);
        }
    }, [year, month]);

    const loadMonthReport = async (y, m) => {
        setLoading(true);
        setError("");

        try {
            const data =
                await monthClosingService.getMonthClosingByYearAndMonth(
                    y,
                    m
                );

            setSelectedClosing(data);

            if (data && data.details) {
                const initialRowInputs = {};

                data.details.forEach((d) => {
                    const empId =
                        d.employee?.id ||
                        d.employeeId;

                    if (empId) {
                        const remaining =
                            d.remainingBalance !== undefined
                                ? d.remainingBalance
                                : 0;

                        initialRowInputs[empId] =
                            remaining > 0
                                ? remaining
                                : "";
                    }
                });

                setRowPaymentInputs(initialRowInputs);

                if (activeHistoryEmployee) {
                    const updatedEmpDetail =
                        data.details.find(
                            (row) =>
                                (
                                    row.employee?.id ||
                                    row.employeeId
                                ) ===
                                (
                                    activeHistoryEmployee.employee?.id ||
                                    activeHistoryEmployee.employeeId
                                )
                        );

                    if (updatedEmpDetail) {
                        setActiveHistoryEmployee(
                            updatedEmpDetail
                        );
                    }
                }
            }
        } catch (err) {
            setSelectedClosing(null);
            setRowPaymentInputs({});

            setError(
                getBackendErrorMessage(
                    err,
                    "Report not found for selected month/year."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRowPaymentInputChange = (
        employeeId,
        value
    ) => {
        clearFieldError(`payment_${employeeId}`);

        setRowPaymentInputs((prev) => ({
            ...prev,
            [employeeId]: value
        }));
    };

    const handleDirectRowPayment = async (d) => {
        clearMessages();

        const empId =
            d.employee?.id ||
            d.employeeId;

        const amountStr =
            rowPaymentInputs[empId];

        if (
            !amountStr ||
            isNaN(amountStr) ||
            parseFloat(amountStr) <= 0
        ) {
            setError(
                "Please enter a valid payment amount."
            );
            return;
        }

        try {
            const paymentAmount =
                parseFloat(amountStr);

            const settlementDate =
                new Date()
                    .toISOString()
                    .split("T")[0];

            const note =
                `Month closing payment for ${month}/${year}`;

            await settlementService.createSettlement({
                employeeId: empId,
                amountPaid: paymentAmount,
                settlementDate: settlementDate,
                note: note
            });

            setRowPaymentInputs((prev) => ({
                ...prev,
                [empId]: ""
            }));

            showSuccessMessage(
                `Payment of ₹${paymentAmount} recorded successfully.`
            );

            await loadMonthReport(
                year,
                month
            );
        } catch (err) {
            console.error(
                "Failed to process direct payment",
                err
            );

            const backendFieldErrors =
                getBackendFieldErrors(err);

            if (
                Object.keys(
                    backendFieldErrors
                ).length > 0
            ) {
                setFieldErrors(
                    backendFieldErrors
                );
            }

            setError(
                getBackendErrorMessage(
                    err,
                    "Failed to process payment record."
                )
            );
        }
    };

    const handleToggleHisabComplete = async (
        detailId,
        currentStatus
    ) => {
        clearMessages();

        try {
            const newStatus =
                !currentStatus;

            await monthClosingService.toggleHisabComplete(
                detailId,
                newStatus
            );

            setSelectedClosing((prev) => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,

                    details: prev.details.map(
                        (row) =>
                            row.id === detailId
                                ? {
                                    ...row,
                                    hisabCompleted:
                                        newStatus
                                }
                                : row
                    )
                };
            });

            showSuccessMessage(
                newStatus
                    ? "Hisab marked as completed successfully."
                    : "Hisab marked as pending successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update Hisab completion status",
                err
            );

            setError(
                getBackendErrorMessage(
                    err,
                    "Failed to update Hisab completion status."
                )
            );
        }
    };

    const handleOpenEditSettlement = (item) => {
        clearMessages();
        setFieldErrors({});

        setSettlementForm({
            id: item.id,
            employeeId:
                item.employee
                    ? item.employee.id
                    : "",
            amountPaid:
                item.amountPaid,
            settlementDate:
                item.settlementDate ||
                new Date()
                    .toISOString()
                    .split("T")[0],
            note:
                item.note || ""
        });

        setShowSettlementModal(true);
    };

    const handleSaveSettlementSubmit = async (e) => {
        e.preventDefault();

        clearMessages();
        setFieldErrors({});

        try {
            if (settlementForm.id) {
                await settlementService.updateSettlement(
                    settlementForm.id,
                    {
                        employeeId:
                            settlementForm.employeeId,

                        amountPaid:
                            parseFloat(
                                settlementForm.amountPaid
                            ),

                        settlementDate:
                            settlementForm.settlementDate,

                        note:
                            settlementForm.note
                    }
                );
            }

            setShowSettlementModal(false);

            showSuccessMessage(
                "Settlement record updated successfully."
            );

            await loadMonthReport(
                year,
                month
            );
        } catch (err) {
            console.error(
                "Failed to update settlement record",
                err
            );

            const backendFieldErrors =
                getBackendFieldErrors(err);

            setFieldErrors(
                backendFieldErrors
            );

            setError(
                getBackendErrorMessage(
                    err,
                    "Failed to update settlement record."
                )
            );
        }
    };

    const handleDeleteSettlement = async (id) => {
        clearMessages();

        if (
            window.confirm(
                "Are you sure you want to delete this payment record? This will adjust balances automatically."
            )
        ) {
            try {
                await settlementService.deleteSettlement(
                    id
                );

                showSuccessMessage(
                    "Settlement record deleted successfully."
                );

                await loadMonthReport(
                    year,
                    month
                );
            } catch (err) {
                console.error(
                    "Failed to delete settlement",
                    err
                );

                setError(
                    getBackendErrorMessage(
                        err,
                        "Failed to delete settlement."
                    )
                );
            }
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6 font-sans text-slate-800">

            {/* Page Header */}
            <div className="mb-5 sm:mb-6">
                <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Month Closing & Hisab Management
                </h2>

                <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                    Track employee attendance, earnings,
                    balances, and process quick payments.
                </p>
            </div>

            {/* Filter Controls */}
            <div className="mb-5 sm:mb-6 bg-white p-4 sm:px-5 sm:py-4 rounded-xl border border-slate-200 shadow-sm">

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-5 sm:items-center">

                    {/* Year */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs sm:text-[13px] font-semibold text-slate-600 min-w-[38px]">
                            Year
                        </label>

                        <input
                            type="number"
                            value={year}
                            onChange={(e) =>
                                setYear(e.target.value)
                            }
                            className="w-full sm:w-[100px] px-3 py-2 rounded-md border border-slate-300 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            required
                        />
                    </div>

                    {/* Month */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs sm:text-[13px] font-semibold text-slate-600 min-w-[38px]">
                            Month
                        </label>

                        <select
                            value={month}
                            onChange={(e) =>
                                setMonth(
                                    parseInt(
                                        e.target.value
                                    )
                                )
                            }
                            className="w-full sm:w-[170px] px-3 py-2 rounded-md border border-slate-300 text-sm outline-none bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        >
                            {Array.from(
                                { length: 12 },
                                (_, i) => (
                                    <option
                                        key={i + 1}
                                        value={i + 1}
                                    >
                                        {new Date(
                                            0,
                                            i
                                        ).toLocaleString(
                                            "default",
                                            {
                                                month:
                                                    "long"
                                            }
                                        )}{" "}
                                        ({i + 1})
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center gap-2 text-sky-600 text-sm font-semibold">
                            <span className="inline-block w-4 h-4 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
                            Loading report...
                        </div>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                    {success}
                </div>
            )}

            {/* Main Report */}
            {selectedClosing && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 overflow-hidden">

                    {/* Report Header */}
                    <div className="px-4 py-4 sm:px-6 sm:py-[18px] border-b border-slate-200 bg-slate-50">
                        <h3 className="m-0 text-sm sm:text-base font-semibold text-slate-900">
                            Report Overview —{" "}
                            {new Date(
                                0,
                                selectedClosing.month - 1
                            ).toLocaleString(
                                "default",
                                {
                                    month: "long"
                                }
                            )}{" "}
                            {selectedClosing.year}
                        </h3>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-4 sm:px-6 sm:py-5 border-b border-slate-200 bg-white">

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

                            {/* Total Employees */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Total Employees
                                </div>

                                <div className="text-2xl font-bold text-slate-900">
                                    {selectedClosing.totalEmployees ?? 0}
                                </div>

                                <div className="mt-1 text-xs text-slate-400">
                                    Active employees in this closing
                                </div>
                            </div>

                            {/* Total Payable */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-5">
                                <div className="text-[11px] sm:text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
                                    Total Payable
                                </div>

                                <div className="text-2xl font-bold text-green-600 break-words">
                                    ₹
                                    {Number(
                                        selectedClosing.totalPayable ?? 0
                                    ).toFixed(2)}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                    Amount currently payable
                                </div>
                            </div>

                            {/* Total Over Advance */}
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5">
                                <div className="text-[11px] sm:text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">
                                    Total Over Advance
                                </div>

                                <div className="text-2xl font-bold text-red-600 break-words">
                                    ₹
                                    {Number(
                                        selectedClosing.totalOverAdvance ?? 0
                                    ).toFixed(2)}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                    Employees with excess advance
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employee Report */}
                    <div className="w-full overflow-x-auto">

                        <table className="w-full min-w-[1050px] border-collapse text-left text-sm">

                            <thead>
                                <tr className="bg-slate-100 text-slate-600 text-[11px] sm:text-xs uppercase tracking-wider">
                                    <th className="px-4 py-3 font-semibold border-b border-slate-200">
                                        Employee
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200">
                                        Present Days
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200">
                                        Total Earning
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200">
                                        Advance
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200">
                                        Remaining Balance
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200 text-center">
                                        Hisab Status
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200 text-center">
                                        Paid History
                                    </th>

                                    <th className="px-4 py-3 font-semibold border-b border-slate-200 text-center">
                                        Quick Pay
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {selectedClosing.details.map(
                                    (d, index) => {

                                        const empId =
                                            d.employee?.id ||
                                            d.employeeId;

                                        const empSettlements =
                                            d.settlements ||
                                            [];

                                        const balance =
                                            d.remainingBalance !==
                                            undefined
                                                ? d.remainingBalance
                                                : 0;

                                        const balanceColor =
                                            balance < 0
                                                ? "text-red-600"
                                                : balance > 0
                                                    ? "text-green-600"
                                                    : "text-blue-600";

                                        const prevBalance =
                                            d.previousBalance ??
                                            d.openingBalance ??
                                            d.lastMonthBalance ??
                                            0;

                                        const advanceVal =
                                            d.totalAdvance ?? 0;

                                        const earningVal =
                                            d.totalEarning ?? 0;

                                        return (
                                            <tr
                                                key={
                                                    d.id ||
                                                    index
                                                }
                                                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                            >

                                                {/* Employee */}
                                                <td className="px-4 py-3.5 text-slate-700">
                                                    <span className="font-semibold text-slate-900">
                                                        {
                                                            d.employeeName
                                                        }
                                                    </span>
                                                </td>

                                                {/* Present */}
                                                <td className="px-4 py-3.5 text-slate-700">
                                                    {
                                                        d.totalPresences
                                                    }
                                                </td>

                                                {/* Earning */}
                                                <td className="px-4 py-3.5 text-slate-700">
                                                    ₹
                                                    {
                                                        earningVal
                                                    }
                                                </td>

                                                {/* Advance */}
                                                <td className="px-4 py-3.5 text-slate-700">
                                                    ₹
                                                    {
                                                        advanceVal
                                                    }
                                                </td>

                                                {/* Balance */}
                                                <td className="px-4 py-3.5 text-slate-700">
                                                    <div
                                                        className={`font-bold text-[15px] ${balanceColor}`}
                                                    >
                                                        ₹
                                                        {
                                                            balance
                                                        }
                                                    </div>

                                                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed whitespace-nowrap">
                                                        (Prev: ₹
                                                        {
                                                            prevBalance
                                                        }{" "}
                                                        + Adv: ₹
                                                        {
                                                            advanceVal
                                                        }{" "}
                                                        - Earn: ₹
                                                        {
                                                            earningVal
                                                        })
                                                    </div>
                                                </td>

                                                {/* Hisab Status */}
                                                <td className="px-4 py-3.5 text-center">
                                                    <label
                                                        className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${
                                                            d.hisabCompleted
                                                                ? "bg-green-50 border-green-200"
                                                                : "bg-slate-50 border-slate-200"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                !!d.hisabCompleted
                                                            }
                                                            onChange={() =>
                                                                handleToggleHisabComplete(
                                                                    d.id,
                                                                    d.hisabCompleted
                                                                )
                                                            }
                                                            className="w-[15px] h-[15px] cursor-pointer accent-green-600"
                                                        />

                                                        <span
                                                            className={`text-xs font-semibold ${
                                                                d.hisabCompleted
                                                                    ? "text-green-600"
                                                                    : "text-slate-500"
                                                            }`}
                                                        >
                                                            {
                                                                d.hisabCompleted
                                                                    ? "Completed"
                                                                    : "Pending"
                                                            }
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Paid History */}
                                                <td className="px-4 py-3.5 text-center">

                                                    <div className="font-semibold text-slate-900 mb-0.5">
                                                        ₹
                                                        {
                                                            d.amountPaid ||
                                                            0
                                                        }
                                                    </div>

                                                    {empSettlements.length >
                                                    0 ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveHistoryEmployee(
                                                                    d
                                                                )
                                                            }
                                                            className="bg-transparent border-none text-sky-600 underline cursor-pointer text-xs p-0 font-medium hover:text-sky-800"
                                                        >
                                                            View History (
                                                            {
                                                                empSettlements.length
                                                            }
                                                            )
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px] italic">
                                                            No records
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Quick Pay */}
                                                <td className="px-4 py-3.5 text-center">

                                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">

                                                        <div className="w-full sm:w-auto">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="Amount"
                                                                value={
                                                                    rowPaymentInputs[
                                                                        empId
                                                                    ] !==
                                                                    undefined
                                                                        ? rowPaymentInputs[
                                                                            empId
                                                                        ]
                                                                        : ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleRowPaymentInputChange(
                                                                        empId,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full sm:w-[90px] px-2 py-1.5 rounded-md border border-slate-300 text-xs outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                                            />

                                                            {fieldErrors.amountPaid && (
                                                                <div className="text-red-600 text-[10px] mt-1">
                                                                    {
                                                                        fieldErrors.amountPaid
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDirectRowPayment(
                                                                    d
                                                                )
                                                            }
                                                            className="w-full sm:w-auto px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white border-none rounded-md cursor-pointer font-semibold text-xs transition-colors"
                                                        >
                                                            Pay
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View History Modal */}
            {activeHistoryEmployee && (
                <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-[999] p-3 sm:p-4">

                    <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">

                            <h3 className="m-0 text-base sm:text-lg font-semibold text-slate-900 truncate pr-4">
                                History:{" "}
                                {
                                    activeHistoryEmployee.employeeName
                                }
                            </h3>

                            <button
                                type="button"
                                onClick={() =>
                                    setActiveHistoryEmployee(
                                        null
                                    )
                                }
                                className="bg-transparent border-none text-xl cursor-pointer text-slate-500 font-bold hover:text-slate-800 shrink-0"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Empty History */}
                        {(
                            !activeHistoryEmployee.settlements ||
                            activeHistoryEmployee.settlements.length ===
                                0
                        ) ? (
                            <p className="text-slate-500 italic text-sm text-center py-5">
                                No payment history
                                records found
                                for this month.
                            </p>
                        ) : (

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[520px] border-collapse text-xs sm:text-[13px] mb-5">

                                    <thead>
                                        <tr className="bg-slate-50 text-slate-600 text-left">
                                            <th className="px-2.5 py-2 border-b border-slate-200 font-semibold">
                                                Date
                                            </th>

                                            <th className="px-2.5 py-2 border-b border-slate-200 font-semibold">
                                                Amount
                                            </th>

                                            <th className="px-2.5 py-2 border-b border-slate-200 font-semibold">
                                                Note
                                            </th>

                                            <th className="px-2.5 py-2 border-b border-slate-200 font-semibold text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {activeHistoryEmployee.settlements.map(
                                            (s) => (
                                                <tr
                                                    key={
                                                        s.id
                                                    }
                                                    className="border-b border-slate-200"
                                                >

                                                    <td className="px-2.5 py-2.5">
                                                        {
                                                            s.settlementDate
                                                        }
                                                    </td>

                                                    <td className="px-2.5 py-2.5 font-semibold text-green-600">
                                                        ₹
                                                        {
                                                            s.amountPaid
                                                        }
                                                    </td>

                                                    <td className="px-2.5 py-2.5 text-slate-500 max-w-[180px] break-words">
                                                        {
                                                            s.note ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="px-2.5 py-2.5 text-center">

                                                        <div className="flex gap-1.5 justify-center">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleOpenEditSettlement(
                                                                        s
                                                                    )
                                                                }
                                                                className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white border-none rounded cursor-pointer text-xs font-medium"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteSettlement(
                                                                        s.id
                                                                    )
                                                                }
                                                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white border-none rounded cursor-pointer text-xs font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveHistoryEmployee(
                                        null
                                    )
                                }
                                className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Settlement Modal */}
            {showSettlementModal && (
                <div className="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-[1000] p-3 sm:p-4">

                    <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[450px] max-h-[90vh] overflow-y-auto shadow-2xl">

                        <h3 className="m-0 mb-4 text-base sm:text-lg font-semibold text-slate-900">
                            Edit Settlement Payment
                        </h3>

                        <form
                            onSubmit={
                                handleSaveSettlementSubmit
                            }
                        >

                            {/* Amount */}
                            <div className="mb-3.5">
                                <label className="block mb-1.5 text-xs sm:text-[13px] font-semibold text-slate-600">
                                    Amount Paid
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    value={
                                        settlementForm.amountPaid
                                    }
                                    onChange={(e) => {
                                        clearFieldError(
                                            "amountPaid"
                                        );

                                        setSettlementForm({
                                            ...settlementForm,
                                            amountPaid:
                                                e.target.value
                                        });
                                    }}
                                    required
                                    className={`w-full px-3 py-2 rounded-md text-sm outline-none border ${
                                        fieldErrors.amountPaid
                                            ? "border-red-600 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                    }`}
                                />

                                {fieldErrors.amountPaid && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {
                                            fieldErrors.amountPaid
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div className="mb-3.5">
                                <label className="block mb-1.5 text-xs sm:text-[13px] font-semibold text-slate-600">
                                    Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        settlementForm.settlementDate
                                    }
                                    onChange={(e) => {
                                        clearFieldError(
                                            "settlementDate"
                                        );

                                        setSettlementForm({
                                            ...settlementForm,
                                            settlementDate:
                                                e.target.value
                                        });
                                    }}
                                    required
                                    className={`w-full px-3 py-2 rounded-md text-sm outline-none border ${
                                        fieldErrors.settlementDate
                                            ? "border-red-600 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                    }`}
                                />

                                {fieldErrors.settlementDate && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {
                                            fieldErrors.settlementDate
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Note */}
                            <div className="mb-5">
                                <label className="block mb-1.5 text-xs sm:text-[13px] font-semibold text-slate-600">
                                    Note
                                </label>

                                <input
                                    type="text"
                                    value={
                                        settlementForm.note
                                    }
                                    onChange={(e) => {
                                        clearFieldError(
                                            "note"
                                        );

                                        setSettlementForm({
                                            ...settlementForm,
                                            note:
                                                e.target.value
                                        });
                                    }}
                                    className={`w-full px-3 py-2 rounded-md text-sm outline-none border ${
                                        fieldErrors.note
                                            ? "border-red-600 focus:ring-2 focus:ring-red-100"
                                            : "border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                    }`}
                                />

                                {fieldErrors.note && (
                                    <div className="text-red-600 text-xs mt-1">
                                        {
                                            fieldErrors.note
                                        }
                                    </div>
                                )}
                            </div>

                            {/* Modal Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSettlementModal(
                                            false
                                        );
                                        setFieldErrors(
                                            {}
                                        );
                                        setError("");
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white border-none rounded-md cursor-pointer text-sm font-semibold transition-colors"
                                >
                                    Update
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthClosingPage;
