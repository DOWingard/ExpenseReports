import React, { useState } from 'react';
import useStore from '../store';

const ExpenseForm = ({ onClose }) => {
    const { addExpense } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        price: '',
        category: 'Personnel',
        isRecurring: false,
        frequency: 'monthly',
        recurringDay: '1'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense(formData);
        onClose();
    };

    return (
        <div className="expense-form">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Add New Entry</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe, Server Costs"
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="Personnel">Personnel</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Vendors">Vendors</option>
                        <option value="Field Expenses">Field Expenses</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief details..."
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Price ($)</label>
                    <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0' }}>
                    <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        style={{ width: 'auto' }}
                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    />
                    <label htmlFor="isRecurring" style={{ margin: 0 }}>Recurring Payment</label>
                </div>

                {formData.isRecurring && (
                    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '4px', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Frequency</label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            >
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="annually">Annually</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Recurs on Day</label>
                            <input
                                type="text"
                                value={formData.recurringDay}
                                onChange={(e) => setFormData({ ...formData, recurringDay: e.target.value })}
                                placeholder="e.g. 1 or Monday"
                            />
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        Save Entry
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;
