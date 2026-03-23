import React, { useState } from 'react';
import useStore from '../store';

import { generateId } from '../db';

const Setup = ({ onCancel }) => {
    const updateSettings = useStore(state => state.updateSettings);
    const addOrganization = useStore(state => state.addOrganization);

    const [formData, setFormData] = useState({
        id: generateId(),
        companyName: '',
        reportFrequency: 'monthly',
        reportDay: '1',
        startDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addOrganization(formData);
        if (onCancel) onCancel();
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '10vh' }}>
            <div className="card">
                <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Create Organization</h1>
                <p style={{ color: '#666' }}>Set up a new company infrastructure.</p>
            </div>

            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label>Company Name</label>
                    <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div className="grid">
                    <div className="form-group">
                        <label>Reporting Frequency</label>
                        <select
                            value={formData.reportFrequency}
                            onChange={(e) => setFormData({ ...formData, reportFrequency: e.target.value })}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Report Day (of month)</label>
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={formData.reportDay}
                            onChange={(e) => setFormData({ ...formData, reportDay: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Accounting Start Date</label>
                    <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {onCancel && (
                        <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        Create Organization
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Setup;
