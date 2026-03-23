import React, { useState, useMemo } from 'react';
import useStore from '../store';
import ExpenseForm from './ExpenseForm';
import ReportView from './ReportView';
import {
    Plus,
    FileText,
    CheckCircle,
    Layout,
    LogOut,
    Home,
    Calendar,
    DollarSign
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { generateReport, FREQUENCY_FACTORS } from '../utils/reportLogic';

const Dashboard = ({ onBackToOrgs }) => {
    const { settings, expenses, removeExpense, reports, addReport } = useStore();
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('expenses');
    const [selectedReport, setSelectedReport] = useState(null);

    // Calculate frequency-aware totals
    const reportFreq = settings?.reportFrequency || 'monthly';
    const reportFactor = FREQUENCY_FACTORS[reportFreq] || 12;

    const recurringTotal = useMemo(() => {
        return expenses
            .filter(e => e.isRecurring)
            .reduce((sum, e) => {
                const expFactor = FREQUENCY_FACTORS[e.frequency] || 12;
                return sum + (Number(e.price) * expFactor / reportFactor);
            }, 0);
    }, [expenses, reportFactor]);

    const currentPeriodTotal = useMemo(() => {
        return expenses.reduce((sum, e) => {
            if (!e.isRecurring) return sum + Number(e.price);
            const expFactor = FREQUENCY_FACTORS[e.frequency] || 12;
            return sum + (Number(e.price) * expFactor / reportFactor);
        }, 0);
    }, [expenses, reportFactor]);

    const handleGenerateReport = () => {
        const periodName = format(new Date(), 'MMMM yyyy');
        const report = generateReport(expenses, periodName, reportFreq);
        addReport(report);
        setActiveTab('reports');
    };

    if (!settings) return null;

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
        <div className="Dashboard">
            <header className="Dashboard-header">
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onBackToOrgs}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '0.9rem' }}
                    >
                        <LogOut size={16} /> Return to Home
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                            background: 'white', padding: '10px', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Home size={24} color="var(--primary)" />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.4rem' }}>{settings.companyName}</h1>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>
                                Payroll Period: {format(new Date(), 'MMMM yyyy')}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>{reportFreq} Recurring</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>${recurringTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'uppercase' }}>Period Total</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>${currentPeriodTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <button
                            onClick={onBackToOrgs}
                            className="btn"
                            style={{
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem'
                            }}
                        >
                            <LogOut size={16} />
                            <span>Switch</span>
                        </button>
                    </div>
                </div>
            </header>

            <nav className="Dashboard-nav">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className={`nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('expenses')}
                        >
                            <Layout size={18} /> Registry
                        </button>
                        <button
                            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            <FileText size={18} /> Reports
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <Plus size={18} style={{ marginRight: '8px' }} /> Add Entry
                    </button>
                </div>
            </nav>

            <main className="container" style={{ marginTop: '2rem' }}>
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
                                            <td>
                                                <span style={{ fontSize: '0.85rem', padding: '2px 8px', background: '#f0f0f0', borderRadius: '12px' }}>
                                                    {exp.category}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.85rem' }}>
                                                {exp.isRecurring ? `Recurring (${exp.frequency})` : 'One-time'}
                                            </td>
                                            <td className="price" style={{ fontWeight: 600 }}>
                                                ${Number(exp.price).toLocaleString()}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => removeExpense(exp.id)}
                                                    className="btn"
                                                    style={{ color: 'var(--danger)', background: 'none', padding: '0' }}
                                                >
                                                    Delete
                                                </button>
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
                                    <div key={report.id} className="card" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderLeft: '4px solid var(--primary)'
                                    }}>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{report.payPeriod}</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {format(parseISO(report.generationDate), 'MMM dd, yyyy')} • {report.expenses?.length || 0} entries
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
                                                ${report.totalCost.toLocaleString()}
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => setSelectedReport(report)}
                                                style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                            >
                                                View Detail
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>

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
