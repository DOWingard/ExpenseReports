import React from 'react';
import { format, parseISO } from 'date-fns';
import { Printer, ArrowLeft } from 'lucide-react';

const ReportView = ({ report, onBack, companyName }) => {
    if (!report) return null;

    const oneTime = report.expenses?.filter(e => !e.isRecurring) || [];
    const recurring = report.expenses?.filter(e => e.isRecurring) || [];

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Dashboard
            </button>

            <div className="invoice card">
                <div className="invoice-header">
                    <div>
                        <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>INVOICE / REPORT</h1>
                        <h2>{companyName}</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p><strong>Period:</strong> {report.payPeriod}</p>
                        <p><strong>Generated:</strong> {format(parseISO(report.generationDate), 'MMM dd, yyyy')}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Recurring Expenses</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Frequency</th>
                                <th className="price">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recurring.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', py: '1rem' }}>No recurring expenses</td></tr>
                            ) : (
                                recurring.map((e, idx) => (
                                    <tr key={idx}>
                                        <td>{e.name}</td>
                                        <td>{e.frequency}</td>
                                        <td className="price">${Number(e.price).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                            <tr style={{ fontWeight: 'bold' }}>
                                <td colSpan="2">Subtotal Recurring</td>
                                <td className="price">${report.totalRecurring.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>One-Time Expenses</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th className="price">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {oneTime.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', py: '1rem' }}>No one-time expenses</td></tr>
                            ) : (
                                oneTime.map((e, idx) => (
                                    <tr key={idx}>
                                        <td>{format(parseISO(e.date), 'MMM dd')}</td>
                                        <td>{e.name}</td>
                                        <td className="price">${Number(e.price).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                            <tr style={{ fontWeight: 'bold' }}>
                                <td colSpan="2">Subtotal One-Time</td>
                                <td className="price">${report.totalOneTime.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{
                    marginTop: '3rem',
                    padding: '1.5rem',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ margin: 0 }}>TOTAL EXPENDITURE</h2>
                    <h1 style={{ margin: 0 }}>${report.totalCost.toLocaleString()}</h1>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <p>Electronically generated for {companyName}</p>
                </div>
            </div>

            <button className="btn btn-primary" onClick={() => window.print()} style={{ marginTop: '2rem', width: '100%' }}>
                <Printer size={18} style={{ marginRight: '8px' }} /> Print Report
            </button>
        </div>
    );
};

export default ReportView;
