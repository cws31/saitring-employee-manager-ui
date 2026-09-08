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

    const [activeHistoryEmployee, setActiveHistoryEmployee] = useState(null);

    const [showSettlementModal, setShowSettlementModal] = useState(false);
    const [settlementForm, setSettlementForm] = useState({
        id: null,
        employeeId: '',
        amountPaid: '',
        settlementDate: new Date().toISOString().split('T')[0],
        note: ''
    });

    useEffect(() => {
        if (year && month) {
            loadMonthReport(year, month);
        }
    }, [year, month]);

    const loadMonthReport = async (y, m) => {
        setLoading(true);
        setError('');
        try {
            const data = await monthClosingService.getMonthClosingByYearAndMonth(y, m);
            setSelectedClosing(data);
            
            if (data && data.details) {
                const initialRowInputs = {};
                data.details.forEach(d => {
                    const empId = d.employee?.id || d.employeeId;
                    if (empId) {
                        const remaining = d.remainingBalance !== undefined ? d.remainingBalance : 0;
                        initialRowInputs[empId] = remaining > 0 ? remaining : '';
                    }
                });
                setRowPaymentInputs(initialRowInputs);

                if (activeHistoryEmployee) {
                    const updatedEmpDetail = data.details.find(
                        row => (row.employee?.id || row.employeeId) === (activeHistoryEmployee.employee?.id || activeHistoryEmployee.employeeId)
                    );
                    if (updatedEmpDetail) {
                        setActiveHistoryEmployee(updatedEmpDetail);
                    }
                }
            }
        } catch (err) {
            setSelectedClosing(null);
            setRowPaymentInputs({});
            setError(err.response?.data?.message || "Report not found for selected month/year.");
        } finally {
            setLoading(false);
        }
    };

    const handleRowPaymentInputChange = (employeeId, value) => {
        setRowPaymentInputs(prev => ({
            ...prev,
            [employeeId]: value
        }));
    };

    const handleDirectRowPayment = async (d) => {
        const empId = d.employee?.id || d.employeeId;
        const amountStr = rowPaymentInputs[empId];

        if (!amountStr || isNaN(amountStr) || parseFloat(amountStr) <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        try {
            const paymentAmount = parseFloat(amountStr);
            const settlementDate = new Date().toISOString().split('T')[0];
            const note = `Month closing payment for ${month}/${year}`;

            await settlementService.createSettlement({
                employeeId: empId,
                amountPaid: paymentAmount,
                settlementDate: settlementDate,
                note: note
            });

            setRowPaymentInputs(prev => ({ ...prev, [empId]: '' }));
            loadMonthReport(year, month);
        } catch (err) {
            console.error("Failed to process direct payment", err);
            alert("Failed to process payment record.");
        }
    };

    const handleToggleHisabComplete = async (detailId, currentStatus) => {
        try {
            const newStatus = !currentStatus;

            await monthClosingService.toggleHisabComplete(
                detailId,
                newStatus
            );

            setSelectedClosing(prev => {
                if (!prev) return prev;

                return {
                    ...prev,
                    details: prev.details.map(row =>
                        row.id === detailId
                            ? {
                                ...row,
                                hisabCompleted: newStatus
                            }
                            : row
                    )
                };
            });

        } catch (err) {
            console.error("Failed to update Hisab completion status", err);
            alert("Failed to update Hisab completion status.");
        }
    };

    const handleOpenEditSettlement = (item) => {
        setSettlementForm({
            id: item.id,
            employeeId: item.employee ? item.employee.id : '',
            amountPaid: item.amountPaid,
            settlementDate: item.settlementDate || new Date().toISOString().split('T')[0],
            note: item.note || ''
        });
        setShowSettlementModal(true);
    };

    const handleSaveSettlementSubmit = async (e) => {
        e.preventDefault();
        try {
            if (settlementForm.id) {
                await settlementService.updateSettlement(settlementForm.id, {
                    employeeId: settlementForm.employeeId,
                    amountPaid: parseFloat(settlementForm.amountPaid),
                    settlementDate: settlementForm.settlementDate,
                    note: settlementForm.note
                });
            }
            setShowSettlementModal(false);
            loadMonthReport(year, month);
        } catch (err) {
            console.error("Failed to update settlement record", err);
            alert("Failed to update settlement record.");
        }
    };

    const handleDeleteSettlement = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment record? This will adjust balances automatically.")) {
            try {
                await settlementService.deleteSettlement(id);
                loadMonthReport(year, month);
            } catch (err) {
                console.error("Failed to delete settlement", err);
                alert("Failed to delete settlement.");
            }
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', color: '#1e293b' }}>
            
            {/* Page Header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.025em' }}>Month Closing & Hisab Management</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Track employee attendance, earnings, balances, and process quick payments.</p>
            </div>

            {/* Filter Controls Bar */}
            <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Year</label>
                    <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        style={{ padding: '8px 12px', width: '100px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                        required 
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Month</label>
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        style={{ padding: '8px 12px', width: '170px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#fff' }}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })} ({i + 1})
                            </option>
                        ))}
                    </select>
                </div>
                {loading && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '14px', fontWeight: '600' }}>Loading report...</div>}
            </div>

            {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

            {/* Main Report Card */}
            {selectedClosing && (
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '30px', overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                            Report Overview — {new Date(0, selectedClosing.month - 1).toLocaleString('default', { month: 'long' })} {selectedClosing.year}
                        </h3>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Employee</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Present Days</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Total Earning</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Advance</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Remaining Balance</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Hisab Status</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Paid History</th>
                                    <th style={{ padding: '12px 16px', fontWeight: '600', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Quick Pay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedClosing.details.map((d, index) => {
                                    const empId = d.employee?.id || d.employeeId;
                                    const empSettlements = d.settlements || [];
                                    const balance = d.remainingBalance !== undefined ? d.remainingBalance : 0;
                                    
                                    const balanceColor = balance < 0 ? '#dc2626' : balance > 0 ? '#16a34a' : '#2563eb';

                                    const prevBalance = d.previousBalance ?? d.openingBalance ?? d.lastMonthBalance ?? 0;
                                    const advanceVal = d.totalAdvance ?? 0;
                                    const earningVal = d.totalEarning ?? 0;

                                    return (
                                        <tr key={d.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{d.employeeName}</td>
                                            <td style={{ padding: '14px 16px', color: '#334155' }}>{d.totalPresences}</td>
                                            <td style={{ padding: '14px 16px', color: '#334155' }}>₹{earningVal}</td>
                                            <td style={{ padding: '14px 16px', color: '#334155' }}>₹{advanceVal}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ fontWeight: '700', color: balanceColor, fontSize: '15px' }}>₹{balance}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>
                                                    (Prev: ₹{prevBalance} + Adv: ₹{advanceVal} - Earn: ₹{earningVal})
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', background: d.hisabCompleted ? '#f0fdf4' : '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: `1px solid ${d.hisabCompleted ? '#bbf7d0' : '#e2e8f0'}` }}>
                                                    <input 
                                                        type="checkbox"
                                                        checked={!!d.hisabCompleted}
                                                        onChange={() => handleToggleHisabComplete(d.id, d.hisabCompleted)}
                                                        style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#16a34a' }}
                                                    />
                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: d.hisabCompleted ? '#16a34a' : '#64748b' }}>
                                                        {d.hisabCompleted ? 'Completed' : 'Pending'}
                                                    </span>
                                                </label>
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>
                                                    ₹{d.amountPaid || 0}
                                                </div>
                                                {empSettlements.length > 0 ? (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setActiveHistoryEmployee(d)}
                                                        style={{ background: 'none', border: 'none', color: '#0284c7', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', padding: 0, fontWeight: '500' }}
                                                    >
                                                        View History ({empSettlements.length})
                                                    </button>
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontSize: '11px', fontStyle: 'italic' }}>No records</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                                                    <input 
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Amt"
                                                        value={rowPaymentInputs[empId] !== undefined ? rowPaymentInputs[empId] : ''}
                                                        onChange={(e) => handleRowPaymentInputChange(empId, e.target.value)}
                                                        style={{ width: '70px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleDirectRowPayment(d)}
                                                        style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                                                    >
                                                        Pay
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View History Modal */}
            {activeHistoryEmployee && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '16px' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>History: {activeHistoryEmployee.employeeName}</h3>
                            <button type="button" onClick={() => setActiveHistoryEmployee(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>&times;</button>
                        </div>
                        
                        {(!activeHistoryEmployee.settlements || activeHistoryEmployee.settlements.length === 0) ? (
                            <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No payment history records found for this month.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left' }}>
                                        <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>Date</th>
                                        <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>Amount</th>
                                        <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: '600' }}>Note</th>
                                        <th style={{ padding: '8px 10px', borderBottom: '1px solid #e2e8f0', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeHistoryEmployee.settlements.map(s => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '10px', color: '#334155' }}>{s.settlementDate}</td>
                                            <td style={{ padding: '10px', fontWeight: '600', color: '#16a34a' }}>₹{s.amountPaid}</td>
                                            <td style={{ padding: '10px', color: '#64748b' }}>{s.note || '-'}</td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                                    <button type="button" onClick={() => handleOpenEditSettlement(s)} style={{ padding: '4px 8px', background: '#eab308', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Edit</button>
                                                    <button type="button" onClick={() => handleDeleteSettlement(s.id)} style={{ padding: '4px 8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div style={{ textAlign: 'right' }}>
                            <button type="button" onClick={() => setActiveHistoryEmployee(null)} style={{ padding: '8px 16px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Settlement Modal */}
            {showSettlementModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Edit Settlement Payment</h3>
                        <form onSubmit={handleSaveSettlementSubmit}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Amount Paid</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={settlementForm.amountPaid} 
                                    onChange={(e) => setSettlementForm({...settlementForm, amountPaid: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Date</label>
                                <input 
                                    type="date" 
                                    value={settlementForm.settlementDate} 
                                    onChange={(e) => setSettlementForm({...settlementForm, settlementDate: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Note</label>
                                <input 
                                    type="text" 
                                    value={settlementForm.note} 
                                    onChange={(e) => setSettlementForm({...settlementForm, note: e.target.value})}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowSettlementModal(false)} style={{ padding: '8px 14px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthClosingPage;