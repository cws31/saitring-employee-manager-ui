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
        console.error(
            "Failed to update Hisab completion status",
            err
        );

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
        <div style={{ padding: '20px', maxWidth: '1350px', margin: '0 auto' }}>
            <h2>Month Closing & Hisab Reports</h2>

            <div style={{ background: '#f9f9f9', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div>
                    <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Year: </label>
                    <input 
                        type="number" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        style={{ padding: '6px', width: '100px' }}
                        required 
                    />
                </div>
                <div>
                    <label style={{ marginRight: '8px', fontWeight: 'bold' }}>Month: </label>
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        style={{ padding: '6px', width: '150px' }}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })} ({i + 1})
                            </option>
                        ))}
                    </select>
                </div>
                {loading && <span style={{ color: '#007bff', fontWeight: 'bold' }}>Loading report...</span>}
            </div>

            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            {selectedClosing && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '30px' }}>
                    <h3 style={{ margin: '0 0 15px 0' }}>📊 Report Details for {selectedClosing.month}/{selectedClosing.year}</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Employee</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Present Days</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total Earning</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Advance</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', color: '#333' }}>Remaining Balance</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', background: '#e8f4fd', textAlign: 'center' }}>Hisab Done</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', background: '#e2f0cb', textAlign: 'center' }}>Amount Paid (History)</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', background: '#e6ffed', textAlign: 'center' }}>Quick Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedClosing.details.map((d, index) => {
                                const empId = d.employee?.id || d.employeeId;
                                const empSettlements = d.settlements || [];
                                const balance = d.remainingBalance !== undefined ? d.remainingBalance : 0;
                                
                                const balanceColor = balance < 0 ? '#dc3545' : balance > 0 ? '#28a745' : '#007bff';

                                const prevBalance = d.previousBalance ?? d.openingBalance ?? d.lastMonthBalance ?? 0;
                                const advanceVal = d.totalAdvance ?? 0;
                                const earningVal = d.totalEarning ?? 0;

                                return (
                                    <tr key={d.id || index}>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.employeeName}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.totalPresences}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{earningVal}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{advanceVal}</td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', color: balanceColor }}>
                                            <div>{balance}</div>
                                            <div style={{ fontSize: '11px', fontWeight: 'normal', color: '#555', marginTop: '2px' }}>
                                                (last month balance({prevBalance}) + month advance({advanceVal}) - months earning({earningVal}))
                                            </div>
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #ddd', background: '#f0f7ff', textAlign: 'center' }}>
                                            <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <input 
                                                    type="checkbox"
                                                    checked={!!d.hisabCompleted}
                                                    onChange={() => handleToggleHisabComplete(d.id, d.hisabCompleted)}
                                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                />
                                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: d.hisabCompleted ? '#28a745' : '#6c757d' }}>
                                                    {d.hisabCompleted ? 'Completed' : 'Pending'}
                                                </span>
                                            </label>
                                        </td>
                                        
                                        <td style={{ padding: '8px', border: '1px solid #ddd', background: '#f4f9ec', textAlign: 'center' }}>
                                            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '3px' }}>
                                                ₹{d.amountPaid || 0}
                                            </div>
                                            {empSettlements.length > 0 ? (
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveHistoryEmployee(d)}
                                                    style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                                                >
                                                    View History ({empSettlements.length})
                                                </button>
                                            ) : (
                                                <span style={{ color: '#888', fontSize: '11px', fontStyle: 'italic' }}>No history</span>
                                            )}
                                        </td>

                                        <td style={{ padding: '8px', border: '1px solid #ddd', background: '#f0fff4', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                                                <input 
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Amount"
                                                    value={rowPaymentInputs[empId] !== undefined ? rowPaymentInputs[empId] : ''}
                                                    onChange={(e) => handleRowPaymentInputChange(empId, e.target.value)}
                                                    style={{ width: '75px', padding: '4px' }}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => handleDirectRowPayment(d)}
                                                    style={{ padding: '4px 8px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
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
            )}

            {activeHistoryEmployee && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '500px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>Payment History: {activeHistoryEmployee.employeeName}</h3>
                            <button type="button" onClick={() => setActiveHistoryEmployee(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
                        </div>
                        
                        {(!activeHistoryEmployee.settlements || activeHistoryEmployee.settlements.length === 0) ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No payment history records found for this month.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
                                        <th style={{ padding: '6px', border: '1px solid #ddd' }}>Date</th>
                                        <th style={{ padding: '6px', border: '1px solid #ddd' }}>Amount</th>
                                        <th style={{ padding: '6px', border: '1px solid #ddd' }}>Note</th>
                                        <th style={{ padding: '6px', border: '1px solid #ddd', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeHistoryEmployee.settlements.map(s => (
                                        <tr key={s.id}>
                                            <td style={{ padding: '6px', border: '1px solid #ddd' }}>{s.settlementDate}</td>
                                            <td style={{ padding: '6px', border: '1px solid #ddd', fontWeight: 'bold', color: '#28a745' }}>₹{s.amountPaid}</td>
                                            <td style={{ padding: '6px', border: '1px solid #ddd', color: '#555' }}>{s.note || '-'}</td>
                                            <td style={{ padding: '6px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                    <button type="button" onClick={() => handleOpenEditSettlement(s)} style={{ padding: '2px 6px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>Edit</button>
                                                    <button type="button" onClick={() => handleDeleteSettlement(s.id)} style={{ padding: '2px 6px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button type="button" onClick={() => setActiveHistoryEmployee(null)} style={{ padding: '6px 14px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showSettlementModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0 }}>Edit Settlement Payment</h3>
                        <form onSubmit={handleSaveSettlementSubmit}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Amount Paid:</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={settlementForm.amountPaid} 
                                    onChange={(e) => setSettlementForm({...settlementForm, amountPaid: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '6px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
                                <input 
                                    type="date" 
                                    value={settlementForm.settlementDate} 
                                    onChange={(e) => setSettlementForm({...settlementForm, settlementDate: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '6px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Note:</label>
                                <input 
                                    type="text" 
                                    value={settlementForm.note} 
                                    onChange={(e) => setSettlementForm({...settlementForm, note: e.target.value})}
                                    style={{ width: '100%', padding: '6px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowSettlementModal(false)} style={{ padding: '6px 12px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '6px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthClosingPage;