import React, { useState, useMemo } from 'react';
import useStore from '../store';
import ExpenseForm from './ExpenseForm';
import ReportView from './ReportView';
import { Plus, Table, FileText, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { generateReport } from '../utils/reportLogic';

const Dashboard = () => {
    const { settings, expenses, removeExpense, reports, addReport } = useStore();
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('expenses');
    const [selectedReport, setSelectedReport] = useState(null);

    const currentPeriodTotal = useMemo(() => {
        return expenses.reduce((sum, e) => sum + Number(e.price), 0);
    }, [expenses]);

    const recurringTotal = useMemo(() => {
        return expenses
            .filter(e => e.isRecurring)
            .reduce((sum, e) => sum + Number(e.price), 0);
    }, [expenses]);

    const handleGenerateReport = () => {
        const periodName = format(new Date(), 'MMMM yyyy');
        const report = generateReport(expenses, periodName);
        addReport(report);
        setActiveTab('reports');
    };

    if (selectedReport) {
        return (
            <ReportView
                report={selectedReport}
                companyName={settings.companyName}
                onBack={() => setSelectedReport(null)}
            />
        );
    }

    return (
        <div className="container">
            <div className="header">
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>{settings.companyName}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Payroll & Expense Tracker</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('expenses')}>
                        <Table size={18} style={{ marginRight: '8px' }} /> Expenses
                    </button>
                    <button className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('reports')}>
                        <FileText size={18} style={{ marginRight: '8px' }} /> Reports
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Add Entry
                    </button>
                </div>
            </div>

            <div className="totals-strip">
                <div className="total-item">
                    <span className="total-label">Current Period Total</span>
                    <span className="total-value">${currentPeriodTotal.toLocaleString()}</span>
                </div>
                <div className="total-item">
                    <span className="total-label">Recurring Payments</span>
                    <span className="total-value">${recurringTotal.toLocaleString()}</span>
                </div>
            </div>

            {activeTab === 'expenses' ? (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Active Registry</h3>
                        <button className="btn btn-secondary" onClick={handleGenerateReport} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                            <CheckCircle size={14} style={{ marginRight: '6px', color: 'var(--primary)' }} /> Close Period & Generate Report
                        </button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th className="price">Amount</th>
                                <th style={{ width: '80px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No entries for this period.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map(exp => (
                                    <tr key={exp.id}>
                                        <td>{format(parseISO(exp.date), 'MMM dd')}</td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{exp.name}</div>
                                            {exp.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.description}</div>}
                                        </td>
                                        <td><span style={{ fontSize: '0.85rem', padding: '2px 8px', background: '#f0f0f0', borderRadius: '12px' }}>{exp.category}</span></td>
                                        <td style={{ fontSize: '0.85rem' }}>{exp.isRecurring ? `Recurring (${exp.frequency})` : 'One-time'}</td>
                                        <td className="price" style={{ fontWeight: 600 }}>${Number(exp.price).toLocaleString()}</td>
                                        <td>
                                            <button onClick={() => removeExpense(exp.id)} className="btn" style={{ color: 'var(--danger)', background: 'none', padding: '0' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <h3 style={{ marginBottom: '1.5rem' }}>Financial Reports</h3>
                    <div className="grid">
                        {reports.length === 0 ? (
                            <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                No reports generated yet.
                            </div>
                        ) : (
                            reports.slice().reverse().map(report => (
                                <div key={report.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{report.payPeriod}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {format(parseISO(report.generationDate), 'MMM dd, yyyy')} • {report.expenses?.length || 0} entries
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>${report.totalCost.toLocaleString()}</div>
                                        <button className="btn btn-secondary" onClick={() => setSelectedReport(report)} style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>View Detail</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <ExpenseForm onClose={() => setShowForm(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
