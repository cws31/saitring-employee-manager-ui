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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [activeHistoryEmployee, setActiveHistoryEmployee] = useState(null);

    const [showSettlementModal, setShowSettlementModal] = useState(false);

    const [settlementForm, setSettlementForm] = useState({
        id: null,
        employeeId: '',
        amountPaid: '',
        settlementDate: new Date().toISOString().split('T')[0],
        note: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});

    /*
     * Extract the backend message returned by GlobalExceptionHandler.
     *
     * Example:
     * {
     *   "status": 404,
     *   "message": "Hisab record not found with id: 10",
     *   "errors": {}
     * }
     */
    const getBackendErrorMessage = (err, fallbackMessage) => {
        const response = err.response?.data;

        if (response?.message) {
            return response.message;
        }

        if (typeof response === 'string') {
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
            typeof response.errors === 'object'
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
        setError('');
        setSuccess('');
    };

    const showSuccessMessage = (message) => {
        setError('');
        setSuccess(message);

        setTimeout(() => {
            setSuccess('');
        }, 2500);
    };

    useEffect(() => {
        if (year && month) {
            loadMonthReport(year, month);
        }
    }, [year, month]);

    const loadMonthReport = async (y, m) => {
        setLoading(true);
        setError('');

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
                                : '';
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
        clearFieldError(
            `payment_${employeeId}`
        );

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
                    .split('T')[0];

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
                [empId]: ''
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
                    : '',
            amountPaid:
                item.amountPaid,
            settlementDate:
                item.settlementDate ||
                new Date()
                    .toISOString()
                    .split('T')[0],
            note:
                item.note || ''
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
        <div
            style={{
                padding: '24px',
                maxWidth: '1400px',
                margin: '0 auto',
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                color: '#1e293b'
            }}
        >

            {/* Page Header */}
            <div style={{ marginBottom: '24px' }}>

                <h2
                    style={{
                        margin: '0 0 6px 0',
                        fontSize: '24px',
                        fontWeight: '700',
                        letterSpacing: '-0.025em'
                    }}
                >
                    Month Closing & Hisab Management
                </h2>

                <p
                    style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#64748b'
                    }}
                >
                    Track employee attendance, earnings,
                    balances, and process quick payments.
                </p>

            </div>

            {/* Filter Controls Bar */}
            <div
                style={{
                    background: '#ffffff',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow:
                        '0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    alignItems: 'center'
                }}
            >

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <label
                        style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#475569'
                        }}
                    >
                        Year
                    </label>

                    <input
                        type="number"
                        value={year}
                        onChange={(e) =>
                            setYear(
                                e.target.value
                            )
                        }
                        style={{
                            padding: '8px 12px',
                            width: '100px',
                            borderRadius: '6px',
                            border:
                                '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                        required
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <label
                        style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#475569'
                        }}
                    >
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
                        style={{
                            padding: '8px 12px',
                            width: '170px',
                            borderRadius: '6px',
                            border:
                                '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            background: '#fff'
                        }}
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
                                        'default',
                                        {
                                            month:
                                                'long'
                                        }
                                    )}{' '}
                                    ({i + 1})
                                </option>
                            )
                        )}
                    </select>
                </div>

                {loading && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#0284c7',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        Loading report...
                    </div>
                )}

            </div>

            {/* Error */}
            {error && (
                <div
                    style={{
                        padding: '12px 16px',
                        background: '#fef2f2',
                        border:
                            '1px solid #fecaca',
                        color: '#dc2626',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}
                >
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div
                    style={{
                        padding: '12px 16px',
                        background: '#f0fdf4',
                        border:
                            '1px solid #bbf7d0',
                        color: '#16a34a',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}
                >
                    {success}
                </div>
            )}

            {/* Main Report Card */}
            {selectedClosing && (
                <div
                    style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border:
                            '1px solid #e2e8f0',
                        boxShadow:
                            '0 1px 3px rgba(0,0,0,0.05)',
                        marginBottom: '30px',
                        overflow: 'hidden'
                    }}
                >

                    <div
                        style={{
                            padding: '18px 24px',
                            borderBottom:
                                '1px solid #e2e8f0',
                            background: '#f8fafc'
                        }}
                    >
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#0f172a'
                            }}
                        >
                            Report Overview —{' '}
                            {new Date(
                                0,
                                selectedClosing.month - 1
                            ).toLocaleString(
                                'default',
                                {
                                    month: 'long'
                                }
                            )}{' '}
                            {selectedClosing.year}
                        </h3>
                    </div>

                    <div
                        style={{
                            overflowX: 'auto'
                        }}
                    >
                        <table
                            style={{
                                width: '100%',
                                borderCollapse:
                                    'collapse',
                                textAlign: 'left',
                                fontSize: '14px'
                            }}
                        >

                            <thead>
                                <tr
                                    style={{
                                        background:
                                            '#f1f5f9',
                                        color:
                                            '#475569',
                                        fontSize:
                                            '12px',
                                        textTransform:
                                            'uppercase',
                                        letterSpacing:
                                            '0.05em'
                                    }}
                                >
                                    <th style={thStyle}>
                                        Employee
                                    </th>

                                    <th style={thStyle}>
                                        Present Days
                                    </th>

                                    <th style={thStyle}>
                                        Total Earning
                                    </th>

                                    <th style={thStyle}>
                                        Advance
                                    </th>

                                    <th style={thStyle}>
                                        Remaining Balance
                                    </th>

                                    <th
                                        style={{
                                            ...thStyle,
                                            textAlign:
                                                'center'
                                        }}
                                    >
                                        Hisab Status
                                    </th>

                                    <th
                                        style={{
                                            ...thStyle,
                                            textAlign:
                                                'center'
                                        }}
                                    >
                                        Paid History
                                    </th>

                                    <th
                                        style={{
                                            ...thStyle,
                                            textAlign:
                                                'center'
                                        }}
                                    >
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
                                                ? '#dc2626'
                                                : balance > 0
                                                    ? '#16a34a'
                                                    : '#2563eb';

                                        const prevBalance =
                                            d.previousBalance ??
                                            d.openingBalance ??
                                            d.lastMonthBalance ??
                                            0;

                                        const advanceVal =
                                            d.totalAdvance ??
                                            0;

                                        const earningVal =
                                            d.totalEarning ??
                                            0;

                                        return (
                                            <tr
                                                key={
                                                    d.id ||
                                                    index
                                                }
                                                style={{
                                                    borderBottom:
                                                        '1px solid #e2e8f0'
                                                }}
                                            >

                                                <td style={tdStyle}>
                                                    <span
                                                        style={{
                                                            fontWeight:
                                                                '600',
                                                            color:
                                                                '#0f172a'
                                                        }}
                                                    >
                                                        {
                                                            d.employeeName
                                                        }
                                                    </span>
                                                </td>

                                                <td style={tdStyle}>
                                                    {
                                                        d.totalPresences
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    ₹
                                                    {
                                                        earningVal
                                                    }
                                                </td>

                                                <td style={tdStyle}>
                                                    ₹
                                                    {
                                                        advanceVal
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontWeight:
                                                                '700',
                                                            color:
                                                                balanceColor,
                                                            fontSize:
                                                                '15px'
                                                        }}
                                                    >
                                                        ₹
                                                        {
                                                            balance
                                                        }
                                                    </div>

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '11px',
                                                            color:
                                                                '#64748b',
                                                            marginTop:
                                                                '2px',
                                                            lineHeight:
                                                                '1.4'
                                                        }}
                                                    >
                                                        (Prev: ₹
                                                        {
                                                            prevBalance
                                                        }{' '}
                                                        + Adv: ₹
                                                        {
                                                            advanceVal
                                                        }{' '}
                                                        - Earn: ₹
                                                        {
                                                            earningVal
                                                        })
                                                    </div>
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        textAlign:
                                                            'center'
                                                    }}
                                                >
                                                    <label
                                                        style={{
                                                            cursor:
                                                                'pointer',
                                                            display:
                                                                'inline-flex',
                                                            alignItems:
                                                                'center',
                                                            gap:
                                                                '6px',
                                                            background:
                                                                d.hisabCompleted
                                                                    ? '#f0fdf4'
                                                                    : '#f8fafc',
                                                            padding:
                                                                '6px 10px',
                                                            borderRadius:
                                                                '6px',
                                                            border:
                                                                `1px solid ${
                                                                    d.hisabCompleted
                                                                        ? '#bbf7d0'
                                                                        : '#e2e8f0'
                                                                }`
                                                        }}
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
                                                            style={{
                                                                width:
                                                                    '15px',
                                                                height:
                                                                    '15px',
                                                                cursor:
                                                                    'pointer',
                                                                accentColor:
                                                                    '#16a34a'
                                                            }}
                                                        />

                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                                fontWeight:
                                                                    '600',
                                                                color:
                                                                    d.hisabCompleted
                                                                        ? '#16a34a'
                                                                        : '#64748b'
                                                            }}
                                                        >
                                                            {
                                                                d.hisabCompleted
                                                                    ? 'Completed'
                                                                    : 'Pending'
                                                            }
                                                        </span>
                                                    </label>
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        textAlign:
                                                            'center'
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            fontWeight:
                                                                '600',
                                                            color:
                                                                '#0f172a',
                                                            marginBottom:
                                                                '2px'
                                                        }}
                                                    >
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
                                                            style={{
                                                                background:
                                                                    'none',
                                                                border:
                                                                    'none',
                                                                color:
                                                                    '#0284c7',
                                                                textDecoration:
                                                                    'underline',
                                                                cursor:
                                                                    'pointer',
                                                                fontSize:
                                                                    '12px',
                                                                padding:
                                                                    0,
                                                                fontWeight:
                                                                    '500'
                                                            }}
                                                        >
                                                            View History (
                                                            {
                                                                empSettlements.length
                                                            }
                                                            )
                                                        </button>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                color:
                                                                    '#94a3b8',
                                                                fontSize:
                                                                    '11px',
                                                                fontStyle:
                                                                    'italic'
                                                            }}
                                                        >
                                                            No records
                                                        </span>
                                                    )}

                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        textAlign:
                                                            'center'
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                'flex',
                                                            gap:
                                                                '6px',
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center'
                                                        }}
                                                    >

                                                        <div>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="Amt"
                                                                value={
                                                                    rowPaymentInputs[
                                                                        empId
                                                                    ] !==
                                                                    undefined
                                                                        ? rowPaymentInputs[
                                                                            empId
                                                                        ]
                                                                        : ''
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleRowPaymentInputChange(
                                                                        empId,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                style={{
                                                                    width:
                                                                        '70px',
                                                                    padding:
                                                                        '6px 8px',
                                                                    borderRadius:
                                                                        '6px',
                                                                    border:
                                                                        '1px solid #cbd5e1',
                                                                    fontSize:
                                                                        '13px',
                                                                    outline:
                                                                        'none'
                                                                }}
                                                            />

                                                            {fieldErrors.amountPaid && (
                                                                <div
                                                                    style={{
                                                                        color:
                                                                            '#dc2626',
                                                                        fontSize:
                                                                            '10px',
                                                                        marginTop:
                                                                            '3px'
                                                                    }}
                                                                >
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
                                                            style={{
                                                                padding:
                                                                    '6px 12px',
                                                                background:
                                                                    '#16a34a',
                                                                color:
                                                                    '#fff',
                                                                border:
                                                                    'none',
                                                                borderRadius:
                                                                    '6px',
                                                                cursor:
                                                                    'pointer',
                                                                fontWeight:
                                                                    '600',
                                                                fontSize:
                                                                    '13px'
                                                            }}
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
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                            'rgba(15, 23, 42, 0.6)',
                        display: 'flex',
                        justifyContent:
                            'center',
                        alignItems:
                            'center',
                        zIndex: 999,
                        padding: '16px'
                    }}
                >

                    <div
                        style={{
                            background: '#fff',
                            padding: '24px',
                            borderRadius:
                                '12px',
                            width: '100%',
                            maxWidth:
                                '500px',
                            maxHeight:
                                '85vh',
                            overflowY:
                                'auto',
                            boxShadow:
                                '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                    >

                        <div
                            style={{
                                display:
                                    'flex',
                                justifyContent:
                                    'space-between',
                                alignItems:
                                    'center',
                                borderBottom:
                                    '1px solid #e2e8f0',
                                paddingBottom:
                                    '12px',
                                marginBottom:
                                    '16px'
                            }}
                        >

                            <h3
                                style={{
                                    margin: 0,
                                    fontSize:
                                        '18px',
                                    fontWeight:
                                        '600',
                                    color:
                                        '#0f172a'
                                }}
                            >
                                History:{' '}
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
                                style={{
                                    background:
                                        'none',
                                    border:
                                        'none',
                                    fontSize:
                                        '20px',
                                    cursor:
                                        'pointer',
                                    color:
                                        '#64748b',
                                    fontWeight:
                                        'bold'
                                }}
                            >
                                &times;
                            </button>

                        </div>

                        {(
                            !activeHistoryEmployee.settlements ||
                            activeHistoryEmployee.settlements.length ===
                                0
                        ) ? (

                            <p
                                style={{
                                    color:
                                        '#64748b',
                                    fontStyle:
                                        'italic',
                                    fontSize:
                                        '14px',
                                    textAlign:
                                        'center',
                                    padding:
                                        '20px 0'
                                }}
                            >
                                No payment history
                                records found
                                for this month.
                            </p>

                        ) : (

                            <table
                                style={{
                                    width:
                                        '100%',
                                    borderCollapse:
                                        'collapse',
                                    fontSize:
                                        '13px',
                                    marginBottom:
                                        '20px'
                                }}
                            >

                                <thead>
                                    <tr
                                        style={{
                                            background:
                                                '#f8fafc',
                                            color:
                                                '#475569',
                                            textAlign:
                                                'left'
                                        }}
                                    >
                                        <th style={historyThStyle}>
                                            Date
                                        </th>

                                        <th style={historyThStyle}>
                                            Amount
                                        </th>

                                        <th style={historyThStyle}>
                                            Note
                                        </th>

                                        <th
                                            style={{
                                                ...historyThStyle,
                                                textAlign:
                                                    'center'
                                            }}
                                        >
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
                                                style={{
                                                    borderBottom:
                                                        '1px solid #e2e8f0'
                                                }}
                                            >

                                                <td style={historyTdStyle}>
                                                    {
                                                        s.settlementDate
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...historyTdStyle,
                                                        fontWeight:
                                                            '600',
                                                        color:
                                                            '#16a34a'
                                                    }}
                                                >
                                                    ₹
                                                    {
                                                        s.amountPaid
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...historyTdStyle,
                                                        color:
                                                            '#64748b'
                                                    }}
                                                >
                                                    {
                                                        s.note ||
                                                        '-'
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...historyTdStyle,
                                                        textAlign:
                                                            'center'
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                'flex',
                                                            gap:
                                                                '6px',
                                                            justifyContent:
                                                                'center'
                                                        }}
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenEditSettlement(
                                                                    s
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    '4px 8px',
                                                                background:
                                                                    '#eab308',
                                                                color:
                                                                    '#fff',
                                                                border:
                                                                    'none',
                                                                borderRadius:
                                                                    '4px',
                                                                cursor:
                                                                    'pointer',
                                                                fontSize:
                                                                    '12px',
                                                                fontWeight:
                                                                    '500'
                                                            }}
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
                                                            style={{
                                                                padding:
                                                                    '4px 8px',
                                                                background:
                                                                    '#dc2626',
                                                                color:
                                                                    '#fff',
                                                                border:
                                                                    'none',
                                                                borderRadius:
                                                                    '4px',
                                                                cursor:
                                                                    'pointer',
                                                                fontSize:
                                                                    '12px',
                                                                fontWeight:
                                                                    '500'
                                                            }}
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
                        )}

                        <div
                            style={{
                                textAlign:
                                    'right'
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveHistoryEmployee(
                                        null
                                    )
                                }
                                style={{
                                    padding:
                                        '8px 16px',
                                    background:
                                        '#64748b',
                                    color:
                                        '#fff',
                                    border:
                                        'none',
                                    borderRadius:
                                        '6px',
                                    cursor:
                                        'pointer',
                                    fontSize:
                                        '14px',
                                    fontWeight:
                                        '600'
                                }}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Edit Settlement Modal */}
            {showSettlementModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background:
                            'rgba(15, 23, 42, 0.6)',
                        display: 'flex',
                        justifyContent:
                            'center',
                        alignItems:
                            'center',
                        zIndex: 1000,
                        padding: '16px'
                    }}
                >

                    <div
                        style={{
                            background: '#fff',
                            padding: '24px',
                            borderRadius:
                                '12px',
                            width: '100%',
                            maxWidth:
                                '400px',
                            boxShadow:
                                '0 10px 25px rgba(0,0,0,0.1)'
                        }}
                    >

                        <h3
                            style={{
                                margin:
                                    '0 0 16px 0',
                                fontSize:
                                    '18px',
                                fontWeight:
                                    '600',
                                color:
                                    '#0f172a'
                            }}
                        >
                            Edit Settlement Payment
                        </h3>

                        <form
                            onSubmit={
                                handleSaveSettlementSubmit
                            }
                        >

                            {/* Amount */}
                            <div
                                style={{
                                    marginBottom:
                                        '14px'
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            'block',
                                        marginBottom:
                                            '6px',
                                        fontSize:
                                            '13px',
                                        fontWeight:
                                            '600',
                                        color:
                                            '#475569'
                                    }}
                                >
                                    Amount Paid
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    value={
                                        settlementForm.amountPaid
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        clearFieldError(
                                            'amountPaid'
                                        );

                                        setSettlementForm({
                                            ...settlementForm,
                                            amountPaid:
                                                e
                                                    .target
                                                    .value
                                        });
                                    }}
                                    required
                                    style={{
                                        width:
                                            '100%',
                                        padding:
                                            '8px 12px',
                                        borderRadius:
                                            '6px',
                                        border:
                                            fieldErrors.amountPaid
                                                ? '1px solid #dc2626'
                                                : '1px solid #cbd5e1',
                                        fontSize:
                                            '14px',
                                        outline:
                                            'none'
                                    }}
                                />

                                {fieldErrors.amountPaid && (
                                    <div
                                        style={{
                                            color:
                                                '#dc2626',
                                            fontSize:
                                                '12px',
                                            marginTop:
                                                '4px'
                                        }}
                                    >
                                        {
                                            fieldErrors.amountPaid
                                        }
                                    </div>
                                )}

                            </div>

                            {/* Date */}
                            <div
                                style={{
                                    marginBottom:
                                        '14px'
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            'block',
                                        marginBottom:
                                            '6px',
                                        fontSize:
                                            '13px',
                                        fontWeight:
                                            '600',
                                        color:
                                            '#475569'
                                    }}
                                >
                                    Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        settlementForm.settlementDate
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        clearFieldError(
                                            'settlementDate'
                                        );

                                        setSettlementForm({
                                            ...settlementForm,
                                            settlementDate:
                                                e
                                                    .target
                                                    .value
                                        });
                                    }}
                                    required
                                    style={{
                                        width:
                                            '100%',
                                        padding:
                                            '8px 12px',
                                        borderRadius:
                                            '6px',
                                        border:
                                            fieldErrors.settlementDate
                                                ? '1px solid #dc2626'
                                                : '1px solid #cbd5e1',
                                        fontSize:
                                            '14px',
                                        outline:
                                            'none'
                                    }}
                                />

                                {fieldErrors.settlementDate && (
                                    <div
                                        style={{
                                            color:
                                                '#dc2626',
                                            fontSize:
                                                '12px',
                                            marginTop:
                                                '4px'
                                        }}
                                    >
                                        {
                                            fieldErrors.settlementDate
                                        }
                                    </div>
                                )}

                            </div>

                            {/* Note */}
                            <div
                                style={{
                                    marginBottom:
                                        '20px'
                                }}
                            >

                                <label
                                    style={{
                                        display:
                                            'block',
                                        marginBottom:
                                            '6px',
                                        fontSize:
                                            '13px',
                                        fontWeight:
                                            '600',
                                        color:
                                            '#475569'
                                    }}
                                >
                                    Note
                                </label>

                                <input
                                    type="text"
                                    value={
                                        settlementForm.note
                                    }
                                    onChange={(
                                        e
                                    ) => {
                                        clearFieldError(
                                            'note'
                                        );

                                        setSettlementForm({
                                            ...settlementForm,
                                            note:
                                                e
                                                    .target
                                                    .value
                                        });
                                    }}
                                    style={{
                                        width:
                                            '100%',
                                        padding:
                                            '8px 12px',
                                        borderRadius:
                                            '6px',
                                        border:
                                            fieldErrors.note
                                                ? '1px solid #dc2626'
                                                : '1px solid #cbd5e1',
                                        fontSize:
                                            '14px',
                                        outline:
                                            'none'
                                    }}
                                />

                                {fieldErrors.note && (
                                    <div
                                        style={{
                                            color:
                                                '#dc2626',
                                            fontSize:
                                                '12px',
                                            marginTop:
                                                '4px'
                                        }}
                                    >
                                        {
                                            fieldErrors.note
                                        }
                                    </div>
                                )}

                            </div>

                            {/* Modal buttons */}
                            <div
                                style={{
                                    display:
                                        'flex',
                                    justifyContent:
                                        'flex-end',
                                    gap:
                                        '10px'
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSettlementModal(
                                            false
                                        );
                                        setFieldErrors(
                                            {}
                                        );
                                        setError(
                                            ''
                                        );
                                    }}
                                    style={{
                                        padding:
                                            '8px 14px',
                                        background:
                                            '#64748b',
                                        color:
                                            '#fff',
                                        border:
                                            'none',
                                        borderRadius:
                                            '6px',
                                        cursor:
                                            'pointer',
                                        fontSize:
                                            '14px',
                                        fontWeight:
                                            '600'
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    style={{
                                        padding:
                                            '8px 14px',
                                        background:
                                            '#16a34a',
                                        color:
                                            '#fff',
                                        border:
                                            'none',
                                        borderRadius:
                                            '6px',
                                        cursor:
                                            'pointer',
                                        fontSize:
                                            '14px',
                                        fontWeight:
                                            '600'
                                    }}
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

/*
 * Reusable table styles.
 * These are presentation-only and do not change business logic.
 */
const thStyle = {
    padding: '12px 16px',
    fontWeight: '600',
    borderBottom: '1px solid #e2e8f0'
};

const tdStyle = {
    padding: '14px 16px',
    color: '#334155'
};

const historyThStyle = {
    padding: '8px 10px',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600'
};

const historyTdStyle = {
    padding: '10px'
};

export default MonthClosingPage;