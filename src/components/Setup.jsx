import React, { useState } from 'react';
import useStore from '../store';

const Setup = () => {
    const { updateSettings } = useStore();
    const [formData, setFormData] = useState({
        companyName: '',
        reportFrequency: 'monthly',
        reportDay: '1',
        startDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '10vh' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Initial Setup</h2>
                <form onSubmit={handleSubmit}>
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

                    <div className="form-group">
                        <label>Reporting Frequency</label>
                        <select
                            value={formData.reportFrequency}
                            onChange={(e) => setFormData({ ...formData, reportFrequency: e.target.value })}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Day of Report (e.g. 1 for 1st of month, or Monday for weekly)</label>
                        <input
                            type="text"
                            required
                            value={formData.reportDay}
                            onChange={(e) => setFormData({ ...formData, reportDay: e.target.value })}
                            placeholder="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Start From Date</label>
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Start Managing Payroll
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Setup;
