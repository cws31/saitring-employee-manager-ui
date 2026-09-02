import React, { useState, useEffect } from 'react';
import { monthClosingService } from '../../api/monthClosingService';
import employeeService from '../../api/employeeService';

const MonthClosingPage = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [closings, setClosings] = useState([]);
    const [selectedClosing, setSelectedClosing] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [extraMoneyMap, setExtraMoneyMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadClosings();
        loadEmployees();
    }, []);

    const loadClosings = async () => {
        try {
            const data = await monthClosingService.getAllMonthClosings();
            setClosings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load month closings", err);
            setClosings([]);
        }
    };

    const loadEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            const employeeList = Array.isArray(data) ? data : (data.content || data.employees || []);
            setEmployees(employeeList);
        } catch (err) {
            console.error("Failed to load employees", err);
            setEmployees([]);
        }
    };

    const handleExtraMoneyChange = (employeeId, value) => {
        setExtraMoneyMap(prev => ({
            ...prev,
            [employeeId]: value === '' ? 0 : parseFloat(value)
        }));
    };

    const handlePreviewMonth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const requestData = {
                year: parseInt(year),
                month: parseInt(month),
                employeeExtraMoneyMap: extraMoneyMap
            };
            const result = await monthClosingService.previewMonthClosing(requestData);
            setSelectedClosing(result);
            setIsPreviewMode(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to preview month.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseMonth = async () => {
        setLoading(true);
        setError('');
        try {
            const requestData = {
                year: parseInt(year),
                month: parseInt(month),
                employeeExtraMoneyMap: extraMoneyMap
            };
            const result = await monthClosingService.closeMonth(requestData);
            alert("Month closed and finalized successfully!");
            setSelectedClosing(result);
            setIsPreviewMode(false);
            loadClosings();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to close month.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewReport = async (y, m) => {
        try {
            const data = await monthClosingService.getMonthClosingByYearAndMonth(y, m);
            setSelectedClosing(data);
            setIsPreviewMode(false);
        } catch (err) {
            alert("Report not found for selected month/year.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Month Closing & Hisab Reports</h2>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {/* Close Month Form Section */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Generate New Month Closing</h3>
                <form onSubmit={handlePreviewMonth}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label>Year: </label>
                            <input 
                                type="number" 
                                value={year} 
                                onChange={(e) => setYear(e.target.value)} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Month (1-12): </label>
                            <input 
                                type="number" 
                                min="1" 
                                max="12" 
                                value={month} 
                                onChange={(e) => setMonth(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <h4>Extra Money Adjustments (+ / - Bonuses/Deductions)</h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '15px', border: '1px solid #ddd', padding: '10px', background: '#fff' }}>
                        {employees.map(emp => (
                            <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                <span>{emp.name} (Rate: {emp.initialRate})</span>
                                <input 
                                    type="number" 
                                    placeholder="Extra Money (e.g. 500 or -200)"
                                    value={extraMoneyMap[emp.id] || ''}
                                    onChange={(e) => handleExtraMoneyChange(emp.id, e.target.value)}
                                    style={{ width: '200px', padding: '4px' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {loading ? 'Processing...' : 'Preview Calculation'}
                        </button>
                    </div>
                </form>
            </div>

            {/* History List */}
            <div style={{ marginBottom: '30px' }}>
                <h3>Past Month Closing History</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {closings.map(c => (
                        <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                            <span>Month: {c.month} / {c.year} (Closed at: {new Date(c.closedAt).toLocaleString()})</span>
                            <button onClick={() => handleViewReport(c.year, c.month)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                                View Report Details
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Detailed Report / Preview View */}
            {selectedClosing && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: isPreviewMode ? '2px dashed #ffc107' : '1px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>
                                {isPreviewMode ? '🔍 Preview Report Draft' : '📊 Report Details'} for {selectedClosing.month}/{selectedClosing.year}
                            </h3>
                            {isPreviewMode && <span style={{ color: '#856404', background: '#fff3cd', padding: '2px 6px', fontSize: '12px', borderRadius: '4px' }}>Uncommitted Preview State</span>}
                        </div>
                        {isPreviewMode && (
                            <button 
                                onClick={handleCloseMonth} 
                                disabled={loading} 
                                style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                {loading ? 'Finalizing...' : 'Confirm & Finalize Closing'}
                            </button>
                        )}
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ background: '#f1f1f1', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Employee</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Present Days</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Rate</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total Earning</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Advance</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Extra (+/-)</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Net Payable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedClosing.details.map((d, index) => (
                                <tr key={d.id || index}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.employeeName}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.totalPresences}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.rate}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.totalEarning}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.totalAdvance}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{d.extraMoney}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>{d.netPayable}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MonthClosingPage;